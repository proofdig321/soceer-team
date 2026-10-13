import { cn } from '@/lib/utils'
import PositionBadge from './position-badge'

export interface PlayerCardProps {
	displayName: string
	shirtNumber?: number | null
	position?: string | null
	squad?: string | null
	className?: string
}

export default function PlayerCard({
	displayName,
	shirtNumber,
	position,
	squad,
	className,
}: PlayerCardProps) {
	return (
		<article className={cn('flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/8 transition-colors', className)}>
			{/* shirt number */}
			<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-forest-mid/60 font-bold text-gold tabular-nums text-lg">
				{shirtNumber ?? '–'}
			</div>

			<div className="flex flex-col gap-1 min-w-0">
				<p className="text-sm font-semibold text-white truncate">{displayName}</p>
				<div className="flex items-center gap-2">
					{position && <PositionBadge position={position} />}
					{squad && <span className="technical text-[10px] text-white/40">{squad}</span>}
				</div>
			</div>
		</article>
	)
}
