import { cn } from '@/lib/utils'

export type TimelineEventType = 'goal' | 'own-goal' | 'yellow-card' | 'red-card' | 'substitution' | 'penalty-scored' | 'penalty-missed'

export interface TimelineEvent {
	minute: number
	type: TimelineEventType
	/** Display name — abbreviated per safeguarding rules */
	playerName?: string | null
	/** For substitutions: player coming on */
	playerOnName?: string | null
	side: 'home' | 'away'
	note?: string | null
}

export interface MatchTimelineProps {
	events: TimelineEvent[]
	homeTeam: string
	awayTeam: string
	className?: string
}

const EVENT_ICON: Record<TimelineEventType, { icon: string; label: string; color: string }> = {
	'goal':            { icon: '⚽', label: 'Goal',            color: 'text-emerald-400' },
	'own-goal':        { icon: '⚽', label: 'Own goal',        color: 'text-red-400' },
	'yellow-card':     { icon: '🟨', label: 'Yellow card',     color: 'text-yellow-400' },
	'red-card':        { icon: '🟥', label: 'Red card',        color: 'text-red-500' },
	'substitution':    { icon: '🔄', label: 'Substitution',    color: 'text-blue-400' },
	'penalty-scored':  { icon: '⚽', label: 'Penalty scored',  color: 'text-emerald-400' },
	'penalty-missed':  { icon: '✗',  label: 'Penalty missed',  color: 'text-red-400' },
}

export default function MatchTimeline({ events, homeTeam, awayTeam, className }: MatchTimelineProps) {
	if (!events.length) return null

	const sorted = [...events].sort((a, b) => a.minute - b.minute)

	return (
		<div className={cn('space-y-1', className)}>
			{/* Header */}
			<div className="grid grid-cols-[1fr_auto_1fr] gap-2 border-b border-white/10 pb-2 text-[10px] text-white/30 technical">
				<span>{homeTeam}</span>
				<span className="text-center">MIN</span>
				<span className="text-right">{awayTeam}</span>
			</div>

			{sorted.map((ev, i) => {
				const meta = EVENT_ICON[ev.type]
				const isHome = ev.side === 'home'

				return (
					<div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-1.5">
						{/* Home side */}
						<div className={cn('flex items-center gap-2', !isHome && 'invisible')}>
							<span className="text-base leading-none" aria-hidden>{meta.icon}</span>
							<div className="flex flex-col min-w-0">
								{ev.playerName && (
									<span className="text-xs font-semibold text-white truncate">{ev.playerName}</span>
								)}
								{ev.type === 'substitution' && ev.playerOnName && (
									<span className="text-[10px] text-white/40 truncate">↑ {ev.playerOnName}</span>
								)}
								{ev.note && (
									<span className="text-[10px] text-white/30 truncate">{ev.note}</span>
								)}
							</div>
						</div>

						{/* Minute */}
						<div className="flex flex-col items-center gap-0.5">
							<span className="tabular-nums text-xs font-black text-white/60">{ev.minute}'</span>
							<span className={cn('text-[9px] technical', meta.color)}>{meta.label}</span>
						</div>

						{/* Away side */}
						<div className={cn('flex items-center justify-end gap-2', isHome && 'invisible')}>
							<div className="flex flex-col items-end min-w-0">
								{ev.playerName && (
									<span className="text-xs font-semibold text-white truncate">{ev.playerName}</span>
								)}
								{ev.type === 'substitution' && ev.playerOnName && (
									<span className="text-[10px] text-white/40 truncate">↑ {ev.playerOnName}</span>
								)}
								{ev.note && (
									<span className="text-[10px] text-white/30 truncate">{ev.note}</span>
								)}
							</div>
							<span className="text-base leading-none" aria-hidden>{meta.icon}</span>
						</div>
					</div>
				)
			})}
		</div>
	)
}
