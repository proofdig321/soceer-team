import Link from 'next/link'
import Img from '@/ui/img'

const SPORTS_LOGO = 'image-ad2716a1593b8e8962104698b949523c0feed5d2-640x154-webp'
const STARS_LOGO  = 'image-4b032d9ebd368d50b7d0a808aaa020dd0438dd61-640x154-webp'

const logoImg = (ref: string) => ({
	_type: 'image' as const,
	asset: { _type: 'reference' as const, _ref: ref },
})

export default function NotFoundView({
	variant = 'sports',
	homeHref = '/',
}: {
	variant?: 'sports' | 'stars'
	homeHref?: string
}) {
	const logoRef = variant === 'stars' ? STARS_LOGO : SPORTS_LOGO
	const label   = variant === 'stars' ? 'Unami Stars' : 'Unami Sports'

	return (
		<div className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden bg-forest px-4 text-center">

			{/* Pitch grid lines — decorative */}
			<div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]">
				<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern id="pitch" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
							<path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#pitch)" />
				</svg>
			</div>

			{/* Centre circle */}
			<div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<div className="size-[480px] rounded-full border border-white/5" />
				<div className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
			</div>

			{/* Gold diagonal accent */}
			<div aria-hidden className="pointer-events-none absolute -right-24 top-0 h-full w-48 rotate-12 bg-gradient-to-b from-gold/5 via-gold/10 to-transparent" />

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center gap-8">
				<Link href={homeHref} className="opacity-80 transition-opacity hover:opacity-100">
					<Img
						image={logoImg(logoRef)}
						width={160}
						className="h-10 w-auto object-contain"
						alt={label}
					/>
				</Link>

				<div className="relative select-none">
					<span
						aria-hidden
						className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(10rem,30vw,18rem)] font-black leading-none text-white/[0.03] tabular-nums"
					>
						404
					</span>
					<p className="relative text-[clamp(5rem,18vw,10rem)] font-black leading-none tabular-nums text-gold drop-shadow-[0_0_60px_rgba(243,185,66,0.3)]">
						404
					</p>
				</div>

				<div className="space-y-2">
					<h1 className="h3 text-white">Page not found</h1>
					<p className="text-sm text-white/50">
						This page has been moved, deleted, or never existed.
					</p>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-3">
					<Link href={homeHref} className="action-gold">
						← Back to home
					</Link>
					<Link href="javascript:history.back()" className="ghost text-white/70">
						Go back
					</Link>
				</div>
			</div>
		</div>
	)
}
