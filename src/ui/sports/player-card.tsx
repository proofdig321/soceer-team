import { cn } from '@/lib/utils'
import PositionBadge from './position-badge'

export interface PlayerCardProps {
	displayName: string
	shirtNumber?: number | null
	position?: string | null
	squad?: string | null
	className?: string
}

const POSITION_COLORS: Record<string, string> = {
	goalkeeper: 'from-gold/20 to-gold/5',
	defender:   'from-blue-500/20 to-blue-500/5',
	midfielder: 'from-emerald-500/20 to-emerald-500/5',
	forward:    'from-red-500/20 to-red-500/5',
}

export default function PlayerCard({
	displayName,
	shirtNumber,
	position,
	squad,
	className,
}: PlayerCardProps) {
	const gradient = position ? (POSITION_COLORS[position] ?? 'from-white/10 to-white/5') : 'from-white/10 to-white/5'

	return (
		<article className={cn(
			'group relative flex items-center gap-0 overflow-hidden rounded-xl border border-white/10 bg-forest transition-all hover:border-gold/20 hover:shadow-[0_0_20px_rgba(243,185,66,0.05)]',
			className,
		)}>
			{/* Jersey number panel */}
			<div className={cn(
				'relative flex h-full w-16 shrink-0 flex-col items-center justify-center bg-gradient-to-br py-5',
				gradient,
			)}>
				<span className="text-2xl font-black tabular-nums text-white leading-none">
					{shirtNumber ?? '–'}
				</span>
				{/* Jersey shape hint */}
				<div aria-hidden className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
			</div>

			{/* Divider */}
			<div className="h-full w-px bg-white/5 self-stretch" />

			{/* Info */}
			<div className="flex flex-1 flex-col gap-1.5 px-4 py-4 min-w-0">
				<p className="text-sm font-bold text-white leading-tight truncate">{displayName}</p>
				<div className="flex items-center gap-2">
					{position && <PositionBadge position={position} />}
					{squad && (
						<span className="technical text-[10px] text-white/30">{squad}</span>
					)}
				</div>
			</div>
		</article>
	)
}
