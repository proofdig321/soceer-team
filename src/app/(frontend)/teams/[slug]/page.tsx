import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
	getPublicSportsTeam,
	getPublicSportsTeamActivity,
} from '@/lib/sports-public'
import {
	CompetitionList,
	EventList,
	FixtureList,
	SportsDirectoryPage,
} from '@/ui/sports/directory'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const team = await getPublicSportsTeam(slug)

	return {
		title: team?.title ?? 'Team',
		description:
			team?.description ??
			`Public team profile for ${team?.title ?? 'Unami Sports'}.`,
	}
}

export default async function TeamPage({ params }: Props) {
	const { slug } = await params
	const team = await getPublicSportsTeam(slug)
	if (!team) notFound()

	return (
		<SportsDirectoryPage
			title={team.title ?? 'Team'}
			intro="This public profile includes only the team information approved for publication."
		>
			<dl className="grid gap-4 sm:grid-cols-2">
				<div>
					<dt className="font-bold">Sport</dt>
					<dd>{team.sport}</dd>
				</div>
				{team.community && (
					<div>
						<dt className="font-bold">Community</dt>
						<dd>{team.community}</dd>
					</div>
				)}
				{team.province && (
					<div>
						<dt className="font-bold">Province</dt>
						<dd>{team.province}</dd>
					</div>
				)}
				{team.description && (
					<div className="sm:col-span-2">
						<dt className="font-bold">About</dt>
						<dd>{team.description}</dd>
					</div>
				)}
			</dl>
			<TeamActivity teamId={team._id} />
		</SportsDirectoryPage>
	)
}

async function TeamActivity({ teamId }: { teamId: string }) {
	const activity = await getPublicSportsTeamActivity(teamId)

	return (
		<div className="grid gap-8">
			<section className="grid gap-4">
				<h2 className="h1">Fixtures and results</h2>
				<FixtureList fixtures={activity.fixtures} />
			</section>
			<section className="grid gap-4">
				<h2 className="h1">Events</h2>
				<EventList events={activity.events} />
			</section>
			<section className="grid gap-4">
				<h2 className="h1">Competitions</h2>
				<CompetitionList competitions={activity.competitions} />
			</section>
		</div>
	)
}
