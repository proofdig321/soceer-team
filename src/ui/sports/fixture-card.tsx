import { cn } from '@/lib/utils'
import ScoreBadge from './score-badge'
import StatusPill from './status-pill'

export interface FixtureCardProps {
	title: string
	opponent: string
	kickoff?: string | null
	venue?: string | null
	status?: string
	homeScore?: number | null
	awayScore?: number | null
	competition?: string | null
	className?: string
}

function formatKickoff(iso?: string | null) {
	if (!iso) return null
	const d = new Date(iso)
	return {
		date: d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }),
		time: d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
	}
}

export default function FixtureCard({
	title,
	opponent,
	kickoff,
	venue,
	status = 'scheduled',
	homeScore,
	awayScore,
	competition,
	className,
}: FixtureCardProps) {
	const ko = formatKickoff(kickoff)
	const isCompleted = status === 'completed'

	return (
		<article className={cn('flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-5 hover:bg-white/8 transition-colors', className)}>
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1">
					{competition && (
						<span className="technical text-[10px] text-white/40">{competition}</span>
					)}
					<p className="text-sm font-semibold text-white leading-tight">{title}</p>
				</div>
				<StatusPill status={status} className="shrink-0" />
			</div>

			{isCompleted ? (
				<ScoreBadge home={homeScore} away={awayScore} />
			) : (
				ko && (
					<div className="flex items-center gap-3 text-sm text-white/60">
						<span>{ko.date}</span>
						<span className="text-white/30">·</span>
						<span>{ko.time}</span>
					</div>
				)
			)}

			{venue && (
				<p className="text-xs text-white/40 truncate">{venue}</p>
			)}
		</article>
	)
}
