import { cn } from '@/lib/utils'
import Img from '@/ui/img'
import StatusPill from './status-pill'

export interface TeamCardProps {
	title: string
	sport?: string | null
	community?: string | null
	province?: string | null
	season?: string | null
	status?: string
	logo?: { asset?: { _ref?: string } } | null
	href?: string | null
	className?: string
}

const SPORT_ICON: Record<string, string> = {
	football:   '⚽',
	rugby:      '🏉',
	basketball: '🏀',
	netball:    '🏐',
	cricket:    '🏏',
	tennis:     '🎾',
	athletics:  '🏃',
}

export default function TeamCard({
	title,
	sport,
	community,
	province,
	season,
	status = 'active',
	logo,
	href,
	className,
}: TeamCardProps) {
	const icon = sport ? (SPORT_ICON[sport] ?? '🏅') : null

	const inner = (
		<article className={cn(
			'group relative flex items-center gap-4 overflow-hidden rounded-xl border border-white/10 bg-forest p-4 transition-all',
			href && 'hover:border-gold/20 hover:shadow-[0_0_20px_rgba(243,185,66,0.05)] cursor-pointer',
			className,
		)}>
			{/* Logo or sport icon */}
			<div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-white/5 overflow-hidden">
				{logo?.asset?._ref ? (
					<Img
						image={logo as any}
						width={56}
						className="h-full w-full object-contain p-1"
						alt={title}
					/>
				) : (
					<span className="text-2xl" aria-hidden>{icon}</span>
				)}
			</div>

			{/* Info */}
			<div className="flex flex-1 flex-col gap-1 min-w-0">
				<p className="text-sm font-bold text-white leading-tight truncate">{title}</p>
				<div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-white/40">
					{community && <span className="truncate">{community}</span>}
					{province && community && <span className="text-white/20">·</span>}
					{province && <span className="truncate">{province}</span>}
					{season && <span className="text-white/20">·</span>}
					{season && <span>{season}</span>}
				</div>
			</div>

			<StatusPill status={status} className="shrink-0" />
		</article>
	)

	if (href) {
		return <a href={href} className="block">{inner}</a>
	}
	return inner
}
