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

			<DirectoryLinks
				counts={{
					teams: teams.length,
					fixtures: fixtures.length,
					events: events.length,
					competitions: competitions.length,
				}}
			/>
		</SportsShell>
	)
}

function DirectoryLinks({
	counts,
}: {
	counts: {
		teams: number
		fixtures: number
		events: number
		competitions: number
	}
}) {
	const directories = [
		{
			href: '/teams',
			title: 'Teams',
			description: 'Active teams that have chosen to publish a public profile.',
			count: counts.teams,
		},
		{
			href: '/fixtures',
			title: 'Fixtures',
			description: 'Approved fixtures and completed results.',
			count: counts.fixtures,
		},
		{
			href: '/events',
			title: 'Events',
			description: 'Events cleared for public listing.',
			count: counts.events,
		},
		{
			href: '/competitions',
			title: 'Competitions',
			description: 'Approved competition announcements.',
			count: counts.competitions,
		},
	]

	return (
		<section className="grid gap-5 border-t border-stroke pt-8">
			<h2 className="h2">Directories</h2>
			<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{directories.map(({ href, title, description, count }) => (
					<li
						className="border-stroke grid content-start gap-2 border p-5"
						key={href}
					>
						<h3 className="h4">
							<Link className="link" href={href}>
								{title}
							</Link>
						</h3>
						<p className="text-sm">{description}</p>
						{count > 0 && (
							<p className="technical text-xs text-foreground/50">
								{count} listed
							</p>
						)}
					</li>
				))}
			</ul>
		</section>
	)
}
