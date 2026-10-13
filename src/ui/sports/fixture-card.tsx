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
	const isLive = status === 'live'

	return (
		<article className={cn(
			'group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-forest transition-all hover:border-gold/20 hover:shadow-[0_0_30px_rgba(243,185,66,0.06)]',
			className,
		)}>
			{/* Pitch centre-line accent */}
			<div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

			{/* Competition banner */}
			{competition && (
				<div className="border-b border-white/5 bg-white/[0.03] px-4 py-2">
					<span className="technical text-[10px] text-white/40">{competition}</span>
				</div>
			)}

			{/* VS block */}
			<div className="relative flex items-center gap-3 px-4 py-5">
				{/* Left team */}
				<div className="flex flex-1 flex-col gap-1 min-w-0">
					<span className="technical text-[9px] text-gold/60">HOME</span>
					<p className="text-sm font-bold text-white leading-tight truncate">{title}</p>
				</div>

				{/* Score / VS */}
				<div className="flex shrink-0 flex-col items-center gap-1">
					{isCompleted || isLive ? (
						<ScoreBadge home={homeScore} away={awayScore} />
					) : (
						<span className="text-lg font-black text-white/20 tracking-widest">VS</span>
					)}
					{isLive && (
						<span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
							<span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
							LIVE
						</span>
					)}
				</div>

				{/* Right team */}
				<div className="flex flex-1 flex-col items-end gap-1 min-w-0">
					<span className="technical text-[9px] text-white/40">AWAY</span>
					<p className="text-sm font-bold text-white/80 leading-tight truncate text-right">{opponent}</p>
				</div>
			</div>

			{/* Footer */}
			<div className="mt-auto flex items-center justify-between gap-3 border-t border-white/5 bg-white/[0.02] px-4 py-2.5">
				<div className="flex items-center gap-2 text-xs text-white/40 min-w-0">
					{ko ? (
						<>
							<span>{ko.date}</span>
							<span className="text-white/20">·</span>
							<span>{ko.time}</span>
						</>
					) : venue ? (
						<span className="truncate">{venue}</span>
					) : null}
				</div>
				<StatusPill status={status} className="shrink-0" />
			</div>
		</article>
	)
}
