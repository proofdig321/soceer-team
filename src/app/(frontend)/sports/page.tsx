import type { Metadata } from 'next'
import Link from 'next/link'
import {
	getPublicSportsCompetitions,
	getPublicSportsEvents,
	getPublicSportsFixtures,
	getPublicSportsTeams,
} from '@/lib/sports-public'
import { SportsShell, SportsSection, SportsEmpty } from '@/ui/sports/primitives'
import {
	TeamGrid,
	FixtureList,
	EventList,
	CompetitionList,
} from '@/ui/sports/components'

export const metadata: Metadata = {
	title: 'Community sport',
	description:
		'Browse approved public Unami Sports teams, fixtures, events and competitions.',
}

export default async function SportsPage() {
	const [teams, fixtures, events, competitions] = await Promise.all([
		getPublicSportsTeams(),
		getPublicSportsFixtures(),
		getPublicSportsEvents(),
		getPublicSportsCompetitions(),
	])

	const hasAny =
		teams.length || fixtures.length || events.length || competitions.length

	return (
		<SportsShell
			title="Community sport"
			intro="Public information is shown only when a record meets its publication and readiness checks."
			current="/sports"
		>
			{!hasAny && (
				<SportsEmpty label="public records — teams and events are being onboarded" />
			)}

			{teams.length > 0 && (
				<SportsSection title="Teams">
					<TeamGrid teams={teams.slice(0, 6)} />
					{teams.length > 6 && (
						<p>
							<Link className="link" href="/teams">
								View all {teams.length} teams →
							</Link>
						</p>
					)}
				</SportsSection>
			)}

			{fixtures.length > 0 && (
				<SportsSection title="Fixtures and results">
					<FixtureList fixtures={fixtures.slice(0, 5)} />
					{fixtures.length > 5 && (
						<p>
							<Link className="link" href="/fixtures">
								View all {fixtures.length} fixtures →
							</Link>
						</p>
					)}
				</SportsSection>
			)}

			{events.length > 0 && (
				<SportsSection title="Events">
					<EventList events={events.slice(0, 4)} />
					{events.length > 4 && (
						<p>
							<Link className="link" href="/events">
								View all {events.length} events →
							</Link>
						</p>
					)}
				</SportsSection>
			)}

			{competitions.length > 0 && (
				<SportsSection title="Competitions">
					<CompetitionList competitions={competitions.slice(0, 4)} />
					{competitions.length > 4 && (
						<p>
							<Link className="link" href="/competitions">
								View all {competitions.length} competitions →
							</Link>
						</p>
					)}
				</SportsSection>
			)}
		</SportsShell>
	)
}
