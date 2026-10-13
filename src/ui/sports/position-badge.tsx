import { cn } from '@/lib/utils'

const POSITION_MAP: Record<string, { abbr: string; className: string }> = {
	goalkeeper: { abbr: 'GK', className: 'bg-gold/20 text-gold' },
	defender:   { abbr: 'DEF', className: 'bg-blue-500/20 text-blue-300' },
	midfielder: { abbr: 'MID', className: 'bg-emerald-500/20 text-emerald-300' },
	forward:    { abbr: 'FWD', className: 'bg-red-500/20 text-red-300' },
}

export default function PositionBadge({ position, className }: { position?: string | null; className?: string }) {
	if (!position) return null
	const resolved = POSITION_MAP[position] ?? { abbr: position.slice(0, 3).toUpperCase(), className: 'bg-white/10 text-white/60' }
	return (
		<span className={cn('technical inline-flex items-center rounded px-1.5 py-0.5 text-[10px]', resolved.className, className)}>
			{resolved.abbr}
		</span>
	)
}
