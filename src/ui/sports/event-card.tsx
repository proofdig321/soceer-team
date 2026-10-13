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

function formatEventDate(start?: string | null, end?: string | null) {
	if (!start) return null
	const s = new Date(start)
	const dateStr = s.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
	const timeStr = s.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
	if (!end) return `${dateStr} · ${timeStr}`
	const e = new Date(end)
	const endTime = e.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
	return `${dateStr} · ${timeStr}–${endTime}`
}

export default function EventCard({
	title,
	startDateTime,
	endDateTime,
	publicVenueName,
	status = 'scheduled',
	className,
}: EventCardProps) {
	const dateLabel = formatEventDate(startDateTime, endDateTime)

	return (
		<article className={cn('flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-5 hover:bg-white/8 transition-colors', className)}>
			<div className="flex items-start justify-between gap-3">
				<p className="text-sm font-semibold text-white leading-tight">{title}</p>
				<StatusPill status={status} className="shrink-0" />
			</div>

			{dateLabel && (
				<p className="text-sm text-white/60">{dateLabel}</p>
			)}

			{publicVenueName && (
				<p className="text-xs text-white/40">{publicVenueName}</p>
			)}
		</article>
	)
}
