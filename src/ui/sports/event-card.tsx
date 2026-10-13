import { cn } from '@/lib/utils'
import StatusPill from './status-pill'

export interface EventCardProps {
	title: string
	startDateTime?: string | null
	endDateTime?: string | null
	publicVenueName?: string | null
	status?: string
	className?: string
}

function parseDate(iso?: string | null) {
	if (!iso) return null
	const d = new Date(iso)
	return {
		day:   d.toLocaleDateString('en-ZA', { day: 'numeric' }),
		month: d.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase(),
		time:  d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
		full:  d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }),
	}
}

export default function EventCard({
	title,
	startDateTime,
	endDateTime,
	publicVenueName,
	status = 'scheduled',
	className,
}: EventCardProps) {
	const start = parseDate(startDateTime)
	const end   = endDateTime ? parseDate(endDateTime) : null

	return (
		<article className={cn(
			'group relative flex overflow-hidden rounded-xl border border-white/10 bg-forest transition-all hover:border-gold/20 hover:shadow-[0_0_20px_rgba(243,185,66,0.05)]',
			className,
		)}>
			{/* Calendar date panel */}
			{start && (
				<div className="flex w-16 shrink-0 flex-col items-center justify-center gap-0.5 border-r border-white/5 bg-gold/10 py-5">
					<span className="text-2xl font-black leading-none text-gold tabular-nums">{start.day}</span>
					<span className="technical text-[9px] text-gold/70">{start.month}</span>
				</div>
			)}

			{/* Content */}
			<div className="flex flex-1 flex-col justify-between gap-3 px-4 py-4 min-w-0">
				<div className="flex items-start justify-between gap-3">
					<p className="text-sm font-bold text-white leading-tight">{title}</p>
					<StatusPill status={status} className="shrink-0" />
				</div>

				<div className="flex flex-col gap-1 text-xs text-white/40">
					{start && (
						<span>
							{start.full}
							{start.time && ` · ${start.time}`}
							{end && ` – ${end.time}`}
						</span>
					)}
					{publicVenueName && (
						<span className="flex items-center gap-1">
							<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
								<path d="M5 1C3.34 1 2 2.34 2 4c0 2.5 3 5 3 5s3-2.5 3-5c0-1.66-1.34-3-3-3zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="currentColor" />
							</svg>
							{publicVenueName}
						</span>
					)}
				</div>
			</div>
		</article>
	)
}
