import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { Module } from '@/modules'
import Eyebrow from '@/ui/eyebrow'
import { PaginatedList } from '@/ui/pagination'
import { FixtureCard } from '@/ui/sports'

const QUERY = groq`*[_type == 'sports.fixture' && team._ref == $teamId && publicListing == true] | order(kickoff asc){
	_id, title, opponent, competition, kickoff, venue, status, homeScore, awayScore
}`

async function getFixtures(teamId: string) {
	'use cache'
	return client
		.withConfig({ token, useCdn: true, perspective: 'published' })
		.fetch(QUERY, { teamId })
}

export default async function SportsFixtures({ teamId, eyebrow, ...props }: {
	teamId?: { _ref?: string }
	eyebrow?: string
	[key: string]: any
}) {
	const ref = teamId?._ref
	if (!ref) return null

	const fixtures = await getFixtures(ref)

	return (
		<Module className="section space-y-6" {...props}>
			{eyebrow && <Eyebrow value={eyebrow} className="text-gold" />}
			{!fixtures?.length ? (
				<p className="text-white/50 text-sm">No fixtures available.</p>
			) : (
				<PaginatedList
					items={fixtures}
					itemsPerPage={9}
					gridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
					renderItem={(f: any) => (
						<FixtureCard
							key={f._id}
							title={f.title}
							opponent={f.opponent}
							kickoff={f.kickoff}
							venue={f.venue}
							status={f.status}
							homeScore={f.homeScore}
							awayScore={f.awayScore}
							competition={f.competition}
						/>
					)}
				/>
			)}
		</Module>
	)
}
