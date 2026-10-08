import type { DynamicFetchOptions } from '@/sanity/lib/live'
import { getSite } from '@/sanity/lib/queries'
import type { LinkList as LinkListType } from '@/sanity/types'
import SanityLink, { type SanityLinkType } from '@/ui/sanity-link'
import LinkList from './link.list'

export default async function ({ perspective, stega }: DynamicFetchOptions) {
	const site = await getSite({ perspective, stega })

	return (
		<nav>
			<ul className="flex flex-wrap items-start justify-center gap-x-12 gap-y-2 max-md:flex-col max-md:text-center">
				{site?.footer?.items?.map((item, i) => {
					switch (item._type) {
						case 'link':
							return (
								<li key={`${item._key}-${i}`}>
									<SanityLink
										link={item as SanityLinkType}
										className="text-sm text-white/60 hover:text-white transition-colors"
									/>
								</li>
							)

						case 'link.list':
							return (
								<LinkList
									key={`${item._key}-${i}`}
									{...(item as unknown as LinkListType)}
								/>
							)

						default:
							return null
					}
				})}
			</ul>
		</nav>
	)
}
