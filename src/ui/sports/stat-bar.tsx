import { cn } from '@/lib/utils'

export interface StatBarProps {
	label: string
	value: number | string
	/** 0–100, drives the fill bar width */
	percent?: number | null
	accent?: 'gold' | 'emerald' | 'red' | 'blue'
	className?: string
}

const ACCENT: Record<string, string> = {
	gold:    'bg-gold',
	emerald: 'bg-emerald-400',
	red:     'bg-red-400',
	blue:    'bg-blue-400',
}

export default function StatBar({ label, value, percent, accent = 'gold', className }: StatBarProps) {
	const fill = percent != null ? Math.min(100, Math.max(0, percent)) : null

	return (
		<div className={cn('flex flex-col gap-1.5', className)}>
			<div className="flex items-baseline justify-between gap-2">
				<span className="text-xs text-white/50">{label}</span>
				<span className="tabular-nums text-sm font-bold text-white">{value}</span>
			</div>
			{fill != null && (
				<div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
					<div
						className={cn('h-full rounded-full transition-all duration-700', ACCENT[accent])}
						style={{ width: `${fill}%` }}
						role="presentation"
					/>
				</div>
			)}
		</div>
	)
}
