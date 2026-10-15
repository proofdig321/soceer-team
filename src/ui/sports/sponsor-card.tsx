import { cn } from '@/lib/utils'

export interface SponsorCardProps {
	organization: string
	isPrivate?: boolean
	acknowledgementLabel?: string | null
	publicAcknowledgementText?: string | null
	website?: string | null
	donorType?: 'individual' | 'organisation'
	donationPurpose?: string | null
	className?: string
}

export default function SponsorCard({
	organization,
	isPrivate,
	acknowledgementLabel,
	publicAcknowledgementText,
	website,
	donorType,
	donationPurpose,
	className,
}: SponsorCardProps) {
	const displayName = isPrivate ? (acknowledgementLabel ?? 'A community supporter') : organization
	const label = publicAcknowledgementText ?? donationPurpose

	const inner = (
		<article className={cn(
			'group flex flex-col gap-3 rounded-xl border border-white/10 bg-forest p-5 transition-all',
			website && !isPrivate && 'hover:border-gold/20 hover:shadow-[0_0_20px_rgba(243,185,66,0.05)]',
			className,
		)}>
			<div className="flex items-start justify-between gap-3">
				<p className="text-sm font-bold text-white leading-snug">{displayName}</p>
				{donorType === 'individual' && (
					<span className="technical shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
						Individual
					</span>
				)}
			</div>
			{label && (
				<p className="text-xs text-white/50 leading-relaxed">{label}</p>
			)}
			{website && !isPrivate && (
				<span className="technical text-[10px] text-gold/50 group-hover:text-gold/80 transition-colors truncate">
					{website.replace(/^https?:\/\//, '')}
				</span>
			)}
		</article>
	)

	if (website && !isPrivate) {
		return (
			<a href={website} target="_blank" rel="noopener noreferrer" className="block">
				{inner}
			</a>
		)
	}

	return inner
}
