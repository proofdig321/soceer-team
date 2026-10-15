import { cn } from '@/lib/utils'
import StatusPill from './status-pill'

export interface CompetitionCardProps {
	title: string
	format?: string | null
	status?: string
	sport?: string | null
	startDate?: string | null
	endDate?: string | null
	teamCount?: number | null
	className?: string
}

const FORMAT_LABEL: Record<string, string> = {
	tournament: 'Tournament',
	league:     'League',
	festival:   'Festival',
}

function formatDate(iso?: string | null) {
	if (!iso) return null
	return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function CompetitionCard({
	title,
	format,
	status = 'concept',
	sport,
	startDate,
	endDate,
	teamCount,
	className,
}: CompetitionCardProps) {
	const start = formatDate(startDate)
	const end   = formatDate(endDate)

	return (
		<article className={cn(
			'group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/10 bg-forest p-5 transition-all hover:border-gold/20 hover:shadow-[0_0_24px_rgba(243,185,66,0.06)]',
			className,
		)}>
			{/* Top accent line */}
			<div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1 min-w-0">
					{format && (
						<span className="technical text-[10px] text-gold/60">
							{FORMAT_LABEL[format] ?? format}
							{sport && ` · ${sport}`}
						</span>
					)}
					<h3 className="text-sm font-bold text-white leading-snug">{title}</h3>
				</div>
				<StatusPill status={status} className="shrink-0" />
			</div>

			<div className="flex items-center gap-4 text-xs text-white/40">
				{start && (
					<span>{start}{end && end !== start ? ` – ${end}` : ''}</span>
				)}
				{teamCount != null && teamCount > 0 && (
					<span className="flex items-center gap-1">
						<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
							<circle cx="3.5" cy="3" r="1.5" fill="currentColor" />
							<circle cx="6.5" cy="3" r="1.5" fill="currentColor" />
							<path d="M1 8.5c0-1.38 1.12-2.5 2.5-2.5h3c1.38 0 2.5 1.12 2.5 2.5" stroke="currentColor" strokeWidth="1" fill="none" />
						</svg>
						{teamCount} {teamCount === 1 ? 'team' : 'teams'}
					</span>
				)}
			</div>
		</article>
	)
}
