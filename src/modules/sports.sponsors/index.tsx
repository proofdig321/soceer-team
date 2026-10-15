import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { Module } from '@/modules'
import Eyebrow from '@/ui/eyebrow'
import { SponsorCard } from '@/ui/sports'

// Fetch stakeholders linked to approved commercial records for this team
const QUERY = groq`*[
	_type == 'sports.commercial' &&
	team._ref == $teamId &&
	status in ['active', 'completed']
]{
	stakeholder->{
		_id,
		organization,
		donorType,
		isPrivate,
		acknowledgementLabel,
		publicAcknowledgement,
		publicAcknowledgementText,
		donationPurpose,
		website,
	}
}[stakeholder.publicAcknowledgement == true].stakeholder`

async function getSponsors(teamId: string) {
	'use cache'
	return client
		.withConfig({ token, useCdn: true, perspective: 'published' })
		.fetch(QUERY, { teamId })
}

export default async function SportsSponsors({ teamId, eyebrow, heading, ...props }: {
	teamId?: { _ref?: string }
	eyebrow?: string
	heading?: string
	[key: string]: any
}) {
	const ref = teamId?._ref
	if (!ref) return null

	const sponsors = await getSponsors(ref)

	if (!sponsors?.length) return null

	return (
		<Module className="section space-y-8" {...props}>
			{eyebrow && <Eyebrow value={eyebrow} className="text-gold" />}
			{heading && <h2 className="h3 text-white">{heading}</h2>}
			<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{sponsors.map((s: any) => (
					<li key={s._id}>
						<SponsorCard
							organization={s.organization}
							isPrivate={s.isPrivate}
							acknowledgementLabel={s.acknowledgementLabel}
							publicAcknowledgementText={s.publicAcknowledgementText}
							website={s.website}
							donorType={s.donorType}
							donationPurpose={s.donationPurpose}
						/>
					</li>
				))}
			</ul>
		</Module>
	)
}
