import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { LINK_QUERY } from '@/sanity/lib/queries'
import { groq } from 'next-sanity'
import Link from 'next/link'
import Img from '@/ui/img'
import Year from '@/ui/year'
import ElementHeight from '@/ui/element-height'
import TeamTheme from '@/ui/team-theme'

const STARS_LOGO_REF = 'image-4b032d9ebd368d50b7d0a808aaa020dd0438dd61-640x154-webp'

// @sanity-typegen-ignore
const NAV_QUERY = groq`*[_id == $id][0]{ items[]{ ${LINK_QUERY} } }`

async function getStarsNav(id: string) {
	'use cache'
	return client
		.withConfig({ token, useCdn: true, perspective: 'published' })
		.fetch(NAV_QUERY, { id })
}

const logoImg = {
	_type: 'image' as const,
	asset: { _type: 'reference' as const, _ref: STARS_LOGO_REF },
}

export default async function StarsLayout({ children }: { children: React.ReactNode }) {
	const [header, footer] = await Promise.all([
		getStarsNav('navigation.stars.header'),
		getStarsNav('navigation.stars.footer'),
	])

	return (
		<>
			<TeamTheme slug="unami-stars" />

			<ElementHeight
				as="header"
				cssVar="--header-height"
				role="banner"
				className="layout-header bg-forest-mid/95 sticky top-0 z-10 backdrop-blur-md border-b border-white/10"
			>
				<div className="section py-3 flex items-center gap-8">
					<Link href="/stars" className="logo inline-block -my-2 h-[2lh]">
						<Img image={logoImg} width={160} className="h-full w-auto object-contain" alt="Unami Stars" />
					</Link>
					<nav className="flex items-center gap-x-6 gap-y-2">
						{header?.items?.map((item: any, i: number) => (
							<Link
								key={i}
								href={item.internal?.slug ?? item.external ?? '#'}
								className="text-sm font-medium text-white/80 hover:text-white transition-colors"
							>
								{item.label}
							</Link>
						))}
					</nav>
				</div>
			</ElementHeight>

			<main id="main-content" tabIndex={-1}>
				{children}
			</main>

			<footer className="bg-forest border-t border-white/10">
				<div className="section py-10">
					<div className="flex gap-12 max-md:flex-col md:items-start">
						<div className="flex flex-col gap-5 md:items-start md:max-w-xs">
							<Link href="/stars" className="logo inline-block h-[2lh]">
								<Img image={logoImg} width={120} className="h-full w-auto object-contain" alt="Unami Stars" />
							</Link>
						</div>
						<nav className="grow">
							<ul className="flex flex-wrap items-start justify-start gap-x-12 gap-y-2 max-md:flex-col">
								{footer?.items?.map((item: any, i: number) => (
									<li key={i}>
										<Link
											href={item.internal?.slug ?? item.external ?? '#'}
											className="text-sm text-white/60 hover:text-white transition-colors"
										>
											{item.label}
										</Link>
									</li>
								))}
								<li>
									<Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">Unami Sports ↗</Link>
								</li>
							</ul>
						</nav>
					</div>
					<div className="mt-12 flex items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40">
						<p>© <Year /> Unami Stars</p>
					</div>
				</div>
			</footer>
		</>
	)
}
