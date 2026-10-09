import { PortableText } from 'next-sanity'
import CustomHTML from '@/modules/custom-html'
import {
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from '@/sanity/lib/live'
import { getSite } from '@/sanity/lib/queries'
import Logo from '@/ui/logo'
import SocialNavigation from '@/ui/social-navigation'
import SanityLink, { type SanityLinkType } from '../sanity-link'
import Navigation from './navigation'

export async function DynamicFooter() {
	const { perspective, stega } = await getDynamicFetchOptions()
	return <CachedFooter perspective={perspective} stega={stega} />
}

export default async function Footer(props: DynamicFetchOptions) {
	return <CachedFooter {...props} />
}

async function CachedFooter({ perspective, stega }: DynamicFetchOptions) {
	const site = await getSite({ perspective, stega })
	const blurb = site?.footer?.blurb

	return (
		<footer className="bg-forest border-t border-white/10">
			<div className="section">
				<div className="flex justify-between gap-12 max-md:flex-col md:items-start">
					<div className="flex flex-col gap-5 max-md:items-center max-md:text-center md:items-start md:max-w-xs">
						<Logo
							className="[&_img]:h-[2lh]"
							perspective={perspective}
							stega={stega}
						/>

						{blurb && (
							<div className="prose text-sm text-white/60">
								<PortableText
									value={blurb}
									components={{
										types: {
											'custom-html': ({ value }) => <CustomHTML {...value} />,
										},
									}}
								/>
							</div>
						)}

						<SocialNavigation
							className="social [&_svg]:size-5 flex items-center gap-4 text-white/50 hover:[&_a]:text-gold max-md:justify-center"
							perspective={perspective}
							stega={stega}
						/>
					</div>

					<Navigation perspective={perspective} stega={stega} />
				</div>

				{(site?.copyright || site?.bottom?.items) && (
					<div className="mt-12 flex items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 not-has-[.bottom-navigation]:justify-center max-md:flex-col max-md:text-center">
						{site?.bottom?.items && (
							<ul className="bottom-navigation flex flex-wrap gap-x-6">
								{site?.bottom?.items?.map((item, i) => (
									<li key={`${item._key}-${i}`}>
										<SanityLink
											link={item as SanityLinkType}
											className="hover:text-white/70 transition-colors"
										/>
									</li>
								))}
							</ul>
						)}

						{site?.copyright && (
							<div className="[&_a]:link copyright md:order-first">
								<PortableText value={site.copyright} />
							</div>
						)}
					</div>
				)}
			</div>
		</footer>
	)
}
