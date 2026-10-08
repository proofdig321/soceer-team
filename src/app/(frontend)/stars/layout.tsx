import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { LINK_QUERY } from '@/sanity/lib/queries'
import { groq } from 'next-sanity'
import Link from 'next/link'
import Img from '@/ui/img'

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
			<header className="layout-header bg-background/80 sticky top-0 z-10 backdrop-blur-[2px]">
				<div className="section flex items-center justify-between gap-4 py-4">
					<Link href="/stars" className="logo inline-block -my-2 h-[2lh]">
						<Img image={logoImg} width={160} className="h-full w-auto object-contain" alt="Unami Stars" />
					</Link>
					<nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
						{header?.items?.map((item: any, i: number) => (
							<Link key={i} href={item.internal ?? item.external ?? '#'} className="hover:underline">
								{item.label}
							</Link>
						))}
					</nav>
				</div>
			</header>

			{children}

			<footer>
				<div className="section flex flex-wrap items-center justify-between gap-4 py-8 text-sm">
					<Link href="/stars" className="logo inline-block h-[2lh]">
						<Img image={logoImg} width={120} className="h-full w-auto object-contain" alt="Unami Stars" />
					</Link>
					<nav className="flex flex-wrap gap-x-6 gap-y-2">
						{footer?.items?.map((item: any, i: number) => (
							<Link key={i} href={item.internal ?? item.external ?? '#'} className="hover:underline">
								{item.label}
							</Link>
						))}
					</nav>
				</div>
			</footer>
		</>
	)
}
