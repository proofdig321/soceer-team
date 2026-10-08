import pkg from '@@/package.json'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { dev, ROUTES } from '@/lib/env'
import { resolveOgImage } from '@/lib/og'
import ModulesResolver from '@/modules'
import {
	getDynamicFetchOptions,
	sanityFetch,
	sanityFetchMetadata,
	type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {
	getSite,
	GLOBAL_MODULE_EXCLUDE_QUERY,
	GLOBAL_MODULE_PATH_QUERY,
	MODULES_QUERY,
} from '@/sanity/lib/queries'
import type { PAGE_QUERY_RESULT } from '@/sanity/types'
import Loading from '@/ui/loading'
import { cacheTag } from 'next/cache'
import { groq } from 'next-sanity'


type Props = PageProps<'/stars/[[...slug]]'>

export default async function Page({ params }: Props) {
	const { isEnabled: isDraftMode } = await draftMode()
	const showDrafts = isDraftMode || dev

	if (showDrafts) {
		return (
			<Suspense fallback={<Loading className="section" />}>
				<DynamicPage params={params} />
			</Suspense>
		)
	}

	return (
		<Suspense fallback={<Loading className="section" />}>
			<PublishedPage params={params} />
		</Suspense>
	)
}

async function PublishedPage({ params }: Pick<Props, 'params'>) {
	const { slug } = await params
	const page = await getPage({ slug, perspective: 'published', stega: false })
	if (!page) notFound()
	return <ModulesResolver page={page} perspective="published" stega={false} />
}

async function DynamicPage({ params }: Pick<Props, 'params'>) {
	const [{ slug }, { perspective, stega }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	])
	const page = await getPage({ slug, perspective, stega })
	if (!page) notFound()
	return <ModulesResolver page={page} perspective={perspective} stega={stega} />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const [{ slug }, { perspective }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	])
	const [page, site] = await Promise.all([
		getPageMetadata({ slug, perspective }),
		getSite({ perspective, stega: false }),
	])
	const { title, description, image, noIndex } = page?.metadata ?? {}

	return {
		title,
		description: description ?? undefined,
		openGraph: {
			type: 'website',
			title,
			description: description ?? undefined,
			url: [process.env.NEXT_PUBLIC_BASE_URL, 'stars', ...(slug ?? [])]
				.filter(Boolean)
				.join('/'),
			images: [
				resolveOgImage({
					image,
					siteOgImage: site?.ogimage,
					slug: ['stars', ...(slug ?? [])].join('/'),
				}),
			],
		},
		robots: { index: noIndex ? false : undefined },
		alternates: {
			types: { 'application/rss+xml': `/${ROUTES.blog}/rss.xml` },
		},
		generator: `SanityPress v${pkg.version}`,
	}
}

async function getPage({
	slug,
	perspective,
	stega,
}: { slug?: string[] } & DynamicFetchOptions) {
	'use cache'
	cacheTag('sanity:page')
	const fullSlug = slug?.length ? `stars/${slug.join('/')}` : 'stars'
	const { data } = await sanityFetch({
		query: PAGE_QUERY,
		params: { slug: fullSlug },
		perspective,
		stega,
	})
	return data as PAGE_QUERY_RESULT
}

async function getPageMetadata({
	slug,
	perspective,
}: { slug?: string[] } & Pick<DynamicFetchOptions, 'perspective'>) {
	const fullSlug = slug?.length ? `stars/${slug.join('/')}` : 'stars'
	return (await sanityFetchMetadata({
		query: PAGE_QUERY,
		params: { slug: fullSlug },
		perspective,
	})) as PAGE_QUERY_RESULT
}

const PAGE_QUERY = groq`
	*[_type == 'page' && metadata.slug.current == $slug][0]{
		...,
		'modules': (
			*[_type == 'global-module' && path == '*' && ${GLOBAL_MODULE_EXCLUDE_QUERY}].before[]{ ${MODULES_QUERY} }
			+ *[_type == 'global-module' && path != '*' && ${GLOBAL_MODULE_PATH_QUERY}].before[]{ ${MODULES_QUERY} }
			+ modules[]{ ${MODULES_QUERY} }
			+ *[_type == 'global-module' && path != '*' && ${GLOBAL_MODULE_PATH_QUERY}].after[]{ ${MODULES_QUERY} }
			+ *[_type == 'global-module' && path == '*' && ${GLOBAL_MODULE_EXCLUDE_QUERY}].after[]{ ${MODULES_QUERY} }
		)
	}
`
