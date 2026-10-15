import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { Module } from '@/modules'
import { NextFixtureBanner } from '@/ui/sports'

const NEXT_QUERY = groq`*[
	_type == 'sports.fixture' &&
	team._ref == $teamId &&
	publicListing == true &&
	status in ['scheduled','live'] &&
	kickoff >= $now
] | order(kickoff asc)[0] {
	_id, title, opponent, kickoff, venue, status, homeScore, awayScore, competition
}`

const LAST_QUERY = groq`*[
	_type == 'sports.fixture' &&
	team._ref == $teamId &&
	publicListing == true &&
	status == 'completed'
] | order(kickoff desc)[0] {
	_id, title, opponent, kickoff, venue, status, homeScore, awayScore, competition
}`

async function getNextFixture(teamId: string) {
	'use cache'
	const now = new Date().toISOString()
	const next = await client
		.withConfig({ token, useCdn: false, perspective: 'published' })
		.fetch(NEXT_QUERY, { teamId, now })
	if (next) return next
	return client
		.withConfig({ token, useCdn: true, perspective: 'published' })
		.fetch(LAST_QUERY, { teamId })
}

export default async function SportsNextFixture({ teamId, ...props }: {
	teamId?: { _ref?: string }
	[key: string]: any
}) {
	const ref = teamId?._ref
	if (!ref) return null

	const fixture = await getNextFixture(ref)
	if (!fixture) return null

	return (
		<Module className="section" {...props}>
			<NextFixtureBanner
				title={fixture.title}
				opponent={fixture.opponent}
				kickoff={fixture.kickoff}
				venue={fixture.venue}
				status={fixture.status}
				homeScore={fixture.homeScore}
				awayScore={fixture.awayScore}
				competition={fixture.competition}
			/>
		</Module>
	)
}
