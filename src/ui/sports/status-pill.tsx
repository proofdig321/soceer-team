import { cn } from '@/lib/utils'

type Status = string

const STATUS_MAP: Record<string, { label: string; className: string }> = {
	scheduled:  { label: 'Scheduled',  className: 'bg-gold/15 text-gold border-gold/30' },
	completed:  { label: 'FT',         className: 'bg-white/10 text-white/70 border-white/20' },
	postponed:  { label: 'Postponed',  className: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
	cancelled:  { label: 'Cancelled',  className: 'bg-red-500/15 text-red-300 border-red-500/30' },
	active:     { label: 'Active',     className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
	onboarding: { label: 'Onboarding', className: 'bg-gold/15 text-gold border-gold/30' },
	paused:     { label: 'Paused',     className: 'bg-white/10 text-white/50 border-white/20' },
	demo:       { label: 'Demo',       className: 'bg-white/5 text-white/40 border-white/10' },
	approved:   { label: 'Approved',   className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
	delivered:  { label: 'Delivered',  className: 'bg-white/10 text-white/70 border-white/20' },
}

export default function StatusPill({ status, className }: { status: Status; className?: string }) {
	const resolved = STATUS_MAP[status] ?? { label: status, className: 'bg-white/10 text-white/60 border-white/20' }
	return (
		<span className={cn('technical inline-flex items-center rounded border px-2 py-0.5 text-[10px]', resolved.className, className)}>
			{resolved.label}
		</span>
	)
}
