import type { Metadata } from 'next'
import Link from 'next/link'
import {
	getPublicSportsCompetitions,
	getPublicSportsEvents,
	getPublicSportsFixtures,
	getPublicSportsTeams,
} from '@/lib/sports-public'
import { SportsDirectoryPage } from '@/ui/sports/directory'

export const metadata: Metadata = {
	title: 'Community sport',
	description:
		'Browse approved public Unami Sports teams, fixtures, events and competitions.',
}

const directories = [
	{
		href: '/teams',
		title: 'Teams',
		description: 'Explore public team profiles.',
	},
	{
		href: '/fixtures',
		title: 'Fixtures',
		description: 'See approved public fixtures and results.',
	},
	{
		href: '/events',
		title: 'Events',
		description: 'Find approved public event listings.',
	},
	{
		href: '/competitions',
		title: 'Competitions',
		description: 'Browse approved competition announcements.',
	},
]

export default async function SportsPage() {
	const [teams, fixtures, events, competitions] = await Promise.all([
		getPublicSportsTeams(),
		getPublicSportsFixtures(),
		getPublicSportsEvents(),
		getPublicSportsCompetitions(),
	])

	return (
		<SportsDirectoryPage
			title="Community sport"
			intro="Public information is shown only when a record meets its publication and readiness checks. Private player and operational records are not displayed here."
		>
			<ul className="grid gap-4 sm:grid-cols-2">
				{directories.map(({ href, title, description }) => {
					const count = {
						Teams: teams.length,
						Fixtures: fixtures.length,
						Events: events.length,
						Competitions: competitions.length,
					}[title]

					return (
						<li className="border-stroke grid gap-2 border p-5" key={href}>
							<h2 className="h2">
								<Link className="link" href={href}>
									{title}
								</Link>
							</h2>
							<p>{description}</p>
							<p>
								{count} public {title.toLowerCase()}
							</p>
						</li>
					)
				})}
			</ul>
		</SportsDirectoryPage>
	)
}
