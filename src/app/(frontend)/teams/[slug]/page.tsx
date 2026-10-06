import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
	getPublicSportsTeam,
	getPublicSportsTeamActivity,
	getPublicSportsTeams,
} from '@/lib/sports-public'
import { SportsNav } from '@/ui/sports/primitives'
import { TeamHero, TeamActivitySection } from '@/ui/sports/components'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const team = await getPublicSportsTeam(slug)
	return {
		title: team?.title ?? 'Team',
		description: team?.description ?? `Public team profile for ${team?.title ?? 'Unami Sports'}.`,
	}
}

export async function generateStaticParams() {
	const teams = await getPublicSportsTeams()
	if (!teams.length) return [{ slug: '__placeholder__' }]
	return teams.map((t) => ({ slug: t.slug }))
}

export default async function TeamPage({ params }: Props) {
	const { slug } = await params
	const team = await getPublicSportsTeam(slug)
	if (!team) notFound()

	return (
		<div className="section grid gap-10 py-12">
			{/* Breadcrumb */}
			<nav aria-label="Breadcrumb" className="text-sm text-foreground/60">
				<ol className="flex flex-wrap items-center gap-1">
					<li>
						<Link className="hover:underline" href="/sports">
							Unami Sports
						</Link>
					</li>
					<li aria-hidden>·</li>
					<li>
						<Link className="hover:underline" href="/teams">
							Teams
						</Link>
					</li>
					<li aria-hidden>·</li>
					<li aria-current="page" className="text-foreground">
						{team.title}
					</li>
				</ol>
			</nav>

			{/* Hero */}
			<TeamHero team={team} />

			{/* Activity */}
			<TeamActivity teamId={team._id} teamTitle={team.title ?? 'this team'} />

			{/* Sports nav */}
			<footer className="border-t border-stroke pt-6">
				<SportsNav current="/teams" />
			</footer>
		</div>
	)
}

async function TeamActivity({
	teamId,
	teamTitle,
}: {
	teamId: string
	teamTitle: string
}) {
	const activity = await getPublicSportsTeamActivity(teamId)

	return (
		<section aria-label={`Activity for ${teamTitle}`}>
			<TeamActivitySection
				fixtures={activity.fixtures}
				events={activity.events}
				competitions={activity.competitions}
				hideTeamLink
			/>
		</section>
	)
}
