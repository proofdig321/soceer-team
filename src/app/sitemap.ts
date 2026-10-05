import type { MetadataRoute } from 'next'
import { groq } from 'next-sanity'
import { ROUTES } from '@/lib/env'
import { sanityFetchMetadata } from '@/sanity/lib/live'

export default async function (): Promise<MetadataRoute.Sitemap> {
	const data = (await sanityFetchMetadata({
		query: groq`{
			'pages': *[
				_type == 'page'
				&& defined(metadata.slug.current)
				&& !(metadata.slug.current in ['404'])
				&& metadata.noIndex != true
			]|order(metadata.slug.current != 'index', metadata.slug.current){
				'url': $baseUrl + select(
					metadata.slug.current == 'index' => '',
					'/' + metadata.slug.current
				),
				'lastModified': _updatedAt,
				'priority': select(
					metadata.slug.current == 'index' => 1,
					0.5
				)
			},
			'posts': *[
				_type == 'blog.post'
				&& defined(metadata.slug.current)
				&& metadata.noIndex != true
			]|order(publishDate desc){
				'url': $baseUrl + '/' + $blogDir + '/' + metadata.slug.current,
				'lastModified': coalesce(publishDate, _updatedAt),
				'priority': 0.4
			},
			'sportsTeams': *[
				_type == 'sports.team'
				&& publicProfile == true
				&& status == 'active'
				&& demoRecord != true
				&& defined(slug.current)
			]|order(title asc){
				'url': $baseUrl + '/teams/' + slug.current,
				'lastModified': _updatedAt,
				'priority': 0.4
			}
		}`,
		params: {
			baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
			blogDir: ROUTES.blog,
		},
		perspective: 'published',
	})) as {
		pages: MetadataRoute.Sitemap
		posts: MetadataRoute.Sitemap
		sportsTeams: MetadataRoute.Sitemap
	}

	const sportsDirectories = [
		'sports',
		'teams',
		'fixtures',
		'events',
		'competitions',
	].map((path) => ({
		url: `${process.env.NEXT_PUBLIC_BASE_URL}/${path}`,
		priority: 0.5,
	}))

	return [...Object.values(data).flat(), ...sportsDirectories]
}
