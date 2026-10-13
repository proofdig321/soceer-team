import { cn } from '@/lib/utils'

/** Displays a score like "2 – 1" or "– vs –" when no score yet */
export default function ScoreBadge({
	home,
	away,
	className,
}: {
	home?: number | null
	away?: number | null
	className?: string
}) {
	const hasScore = home != null && away != null
	return (
		<div className={cn('flex items-center gap-2 font-bold tabular-nums', className)}>
			<span className={cn('text-2xl', hasScore ? 'text-white' : 'text-white/30')}>
				{hasScore ? home : '–'}
			</span>
			<span className="text-sm text-white/40">–</span>
			<span className={cn('text-2xl', hasScore ? 'text-white' : 'text-white/30')}>
				{hasScore ? away : '–'}
			</span>
		</div>
	)
}
