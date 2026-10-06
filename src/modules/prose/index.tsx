import { PortableText } from 'next-sanity'
import { cn } from '@/lib/utils'
import { Module } from '@/modules'
import CustomHTML from '@/modules/custom-html'
import type { Prose } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Sidebar from '@/ui/sidebar'
import TableOfContents from '@/ui/table-of-contents'
import AnchoredHeading from './anchored-heading'
import Code from './code'
import Image from './image'
import Table from './table'

function resolveEmbedUrl(raw: string): string | null {
	try {
		const url = new URL(raw)
		const ytId = url.searchParams.get('v') || (url.hostname === 'youtu.be' ? url.pathname.slice(1) : null)
		if (ytId) return `https://www.youtube-nocookie.com/embed/${ytId}`
		const vimeoMatch = url.pathname.match(/\/(\d+)/)
		if (url.hostname.includes('vimeo') && vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`
	} catch {}
	return null
}

function ProseVideoEmbed({ url, title, caption }: { url?: string; title?: string; caption?: string }) {
	if (!url) return null
	const embedUrl = resolveEmbedUrl(url)
	if (!embedUrl) return null
	return (
		<figure className="not-prose">
			<div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
				<iframe
					src={embedUrl}
					title={title ?? 'Video'}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					loading="lazy"
					className="absolute inset-0 size-full border-0"
				/>
			</div>
			{caption && <figcaption className="mt-2 text-center text-sm text-foreground/60">{caption}</figcaption>}
		</figure>
	)
}

export default function ({
	content,
	sidebar,
	headings,
	...props
}: Prose & React.ComponentProps<typeof TableOfContents>) {
	return (
		<Module
			className={cn(
				'section',
				sidebar && 'gap-lh flex max-md:flex-col md:items-start',
			)}
			{...props}
		>
			<Sidebar
				{...sidebar}
				headings={headings}
				className="max-md:p-ch max-md:bg-current/5"
			/>

			<article className="prose mx-auto w-full max-w-3xl">
				<PortableText
					value={content ?? []}
					components={{
						block: {
							h1: (node) => <AnchoredHeading as="h1" {...node} />,
							h2: (node) => <AnchoredHeading as="h2" {...node} />,
							h3: (node) => <AnchoredHeading as="h3" {...node} />,
							h4: (node) => <AnchoredHeading as="h4" {...node} />,
							h5: (node) => <AnchoredHeading as="h5" {...node} />,
							h6: (node) => <AnchoredHeading as="h6" {...node} />,
						},
						types: {
							image: Image,
							ctas: ({ value }) => <CTAList ctas={value.ctas} />,
							code: Code,
							table: Table,
							'custom-html': ({ value }) => <CustomHTML {...value} />,
							videoEmbed: ({ value }) => <ProseVideoEmbed url={value.url} title={value.title} caption={value.caption} />,
						},
					}}
				/>
			</article>
		</Module>
	)
}
