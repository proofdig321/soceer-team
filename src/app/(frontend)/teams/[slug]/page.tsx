import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
	getPublicSportsTeam,
	getPublicSportsTeamActivity,
	getPublicSportsTeams,
} from '@/lib/sports-public'
import {
	getOpsStakeholders, getOpsCommercial, getOpsPilots,
	getOpsGovernance, getOpsResources, getOpsTraining,
	getOpsSupport, getOpsCustomization, getOpsPlayers,
} from '@/lib/sports-ops'
import { SportsNav, SportsSection } from '@/ui/sports/primitives'
import { TeamHero, TeamActivitySection } from '@/ui/sports/components'
import {
	StakeholderList, CommercialList, PilotList, GovernanceList,
	ResourceList, TrainingList, SupportList, CustomizationList, PlayerList,
} from '@/ui/sports/ops-components'

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

			{/* Operational layer */}
			<TeamOpsLayer teamId={team._id} />

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

async function TeamOpsLayer({ teamId }: { teamId: string }) {
	const [stakeholders, commercial, pilots, governance, resources, training, support, customization, players] =
		await Promise.all([
			getOpsStakeholders(),
			getOpsCommercial(),
			getOpsPilots(),
			getOpsGovernance(),
			getOpsResources(),
			getOpsTraining(),
			getOpsSupport(),
			getOpsCustomization(),
			getOpsPlayers(),
		])

	// Filter to this team where possible
	const teamCommercial = commercial.filter(c => !c.teamTitle || c.teamTitle === 'Unami Stars')
	const teamPilots = pilots.filter(p => !p.teamTitle || p.teamTitle === 'Unami Stars')
	const teamGovernance = governance.filter(g => !g.teamTitle || g.teamTitle === 'Unami Stars')
	const teamResources = resources.filter(r => !r.teamTitle || r.teamTitle === 'Unami Stars')
	const teamTraining = training.filter(t => !t.teamTitle || t.teamTitle === 'Unami Stars')
	const teamSupport = support.filter(s => !s.teamTitle || s.teamTitle === 'Unami Stars')
	const teamCustomization = customization.filter(c => !c.teamTitle || c.teamTitle === 'Unami Stars')
	const teamPlayers = players.filter(p => !p.teamTitle || p.teamTitle === 'Unami Stars')

	return (
		<div className="grid gap-10 border-t border-stroke pt-10">
			<p className="technical text-xs text-foreground/40 uppercase tracking-widest">Operational layer — demo</p>

			<SportsSection title="Stakeholders">
				<StakeholderList stakeholders={stakeholders} />
			</SportsSection>

			<SportsSection title="Commercial and partnerships">
				<CommercialList items={teamCommercial} />
			</SportsSection>

			<SportsSection title="Pilot record">
				<PilotList pilots={teamPilots} />
			</SportsSection>

			<SportsSection title="Governance documents">
				<GovernanceList items={teamGovernance} />
			</SportsSection>

			<SportsSection title="Resources">
				<ResourceList items={teamResources} />
			</SportsSection>

			<SportsSection title="Training sessions">
				<TrainingList items={teamTraining} />
			</SportsSection>

			<SportsSection title="Support requests">
				<SupportList items={teamSupport} />
			</SportsSection>

			<SportsSection title="Customization requests">
				<CustomizationList items={teamCustomization} />
			</SportsSection>

			<SportsSection title="Player records">
				<PlayerList players={teamPlayers} />
			</SportsSection>
		</div>
	)
}
