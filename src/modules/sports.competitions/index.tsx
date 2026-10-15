import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { Module } from '@/modules'
import Eyebrow from '@/ui/eyebrow'
import { PaginatedList } from '@/ui/pagination'
import { CompetitionCard } from '@/ui/sports'

const QUERY = groq`*[
	_type == 'sports.competition' &&
	publicAnnouncementApproved == true &&
	!demoRecord &&
	status in ['approved','active','completed'] &&
	$teamId in teams[]._ref
] | order(startDate desc) {
	_id, title, format, status, sport, startDate, endDate,
	teamCount: count(teams)
}`

async function getCompetitions(teamId: string) {
	'use cache'
	return client
		.withConfig({ token, useCdn: true, perspective: 'published' })
		.fetch(QUERY, { teamId })
}

export default async function SportsCompetitions({ teamId, eyebrow, heading, ...props }: {
	teamId?: { _ref?: string }
	eyebrow?: string
	heading?: string
	[key: string]: any
}) {
	const ref = teamId?._ref
	if (!ref) return null

	const competitions = await getCompetitions(ref)

	return (
		<Module className="section space-y-6" {...props}>
			{eyebrow && <Eyebrow value={eyebrow} className="text-gold" />}
			{heading && <h2 className="h3 text-white">{heading}</h2>}
			{!competitions?.length ? (
				<p className="text-white/50 text-sm">No competitions available.</p>
			) : (
				<PaginatedList
					items={competitions}
					itemsPerPage={9}
					gridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
					renderItem={(c: any) => (
						<CompetitionCard
							key={c._id}
							title={c.title}
							format={c.format}
							status={c.status}
							sport={c.sport}
							startDate={c.startDate}
							endDate={c.endDate}
							teamCount={c.teamCount}
						/>
					)}
				/>
			)}
		</Module>
	)
}
