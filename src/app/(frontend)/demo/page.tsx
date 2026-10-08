import type { Metadata } from 'next'
import {
	getOpsStakeholders, getOpsCommercial, getOpsPilots,
	getOpsGovernance, getOpsResources, getOpsTraining,
	getOpsSupport, getOpsCustomization, getOpsPlayers,
} from '@/lib/sports-ops'
import { getPublicSportsTeams, getPublicSportsFixtures, getPublicSportsEvents, getPublicSportsCompetitions } from '@/lib/sports-public'
import { SportsShell, SportsSection } from '@/ui/sports/primitives'
import { TeamGrid, FixtureSplitList, EventList, CompetitionList } from '@/ui/sports/components'
import {
	StakeholderList, CommercialList, PilotList, GovernanceList,
	ResourceList, TrainingList, SupportList, CustomizationList, PlayerList,
} from '@/ui/sports/ops-components'

export const metadata: Metadata = {
	title: 'Platform demo — Unami Sports',
	description: 'Full operational layer demo: every schema type surfaced — public data, commercial layer, governance, pilot, training, support and customization.',
}

export default async function DemoPage() {
	const [
		teams, fixtures, events, competitions,
		stakeholders, commercial, pilots, governance,
		resources, training, support, customization, players,
	] = await Promise.all([
		getPublicSportsTeams(),
		getPublicSportsFixtures(),
		getPublicSportsEvents(),
		getPublicSportsCompetitions(),
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

	return (
		<SportsShell
			eyebrow="UNAMI SPORTS · FULL PLATFORM DEMO"
			title="Everything on the platform."
			intro="This page surfaces every schema type — public data, operational layer, commercial agreements, governance, pilot records, training, support and customization. This is the demo; nothing is hidden."
		>
			{/* ── PUBLIC LAYER ── */}
			<SportsSection title="Public: Teams">
				<p className="text-sm text-foreground/60 -mt-2">
					Active teams with publicProfile:true and demoRecord:false.
				</p>
				<TeamGrid teams={teams} />
			</SportsSection>

			<SportsSection title="Public: Fixtures and results">
				<p className="text-sm text-foreground/60 -mt-2">
					publicListing:true, status scheduled or completed, team is public.
				</p>
				<FixtureSplitList fixtures={fixtures} />
			</SportsSection>

			<SportsSection title="Public: Events">
				<p className="text-sm text-foreground/60 -mt-2">
					All 6 readiness checks must be true before listing.
				</p>
				<EventList events={events} />
			</SportsSection>

			<SportsSection title="Public: Competitions">
				<p className="text-sm text-foreground/60 -mt-2">
					publicAnnouncementApproved:true, all 4 approval checks true.
				</p>
				<CompetitionList competitions={competitions} />
			</SportsSection>

			{/* ── OPERATIONAL LAYER ── */}
			<SportsSection title="Operational: Stakeholders">
				<p className="text-sm text-foreground/60 -mt-2">
					All stakeholders — publicAcknowledgement flag controls what can be shown publicly.
				</p>
				<StakeholderList stakeholders={stakeholders} />
			</SportsSection>

			<SportsSection title="Operational: Commercial and partnerships">
				<p className="text-sm text-foreground/60 -mt-2">
					Sponsorship, grants, in-kind support and service agreements — with approval status.
				</p>
				<CommercialList items={commercial} />
			</SportsSection>

			<SportsSection title="Operational: Pilot records">
				<p className="text-sm text-foreground/60 -mt-2">
					Pilot lifecycle with 6 readiness gates shown as live checks.
				</p>
				<PilotList pilots={pilots} />
			</SportsSection>

			<SportsSection title="Operational: Governance documents">
				<p className="text-sm text-foreground/60 -mt-2">
					Constitution, safeguarding, finance and privacy starters — status and review dates.
				</p>
				<GovernanceList items={governance} />
			</SportsSection>

			<SportsSection title="Operational: Resources and finance">
				<p className="text-sm text-foreground/60 -mt-2">
					Expenses, in-kind contributions and income records — not an accounting ledger.
				</p>
				<ResourceList items={resources} />
			</SportsSection>

			<SportsSection title="Operational: Training sessions">
				<p className="text-sm text-foreground/60 -mt-2">
					Adult administrator onboarding — topic, delivery mode, outcomes and follow-up.
				</p>
				<TrainingList items={training} />
			</SportsSection>

			<SportsSection title="Operational: Support requests">
				<p className="text-sm text-foreground/60 -mt-2">
					Routine platform issues — category, priority, status and resolution.
				</p>
				<SupportList items={support} />
			</SportsSection>

			<SportsSection title="Operational: Customization requests">
				<p className="text-sm text-foreground/60 -mt-2">
					Team-requested changes — area, approval status and implementation notes.
				</p>
				<CustomizationList items={customization} />
			</SportsSection>

			<SportsSection title="Operational: Player records">
				<p className="text-sm text-foreground/60 -mt-2">
					All player records — publicProfile and guardianConsent status shown. Private by default.
				</p>
				<PlayerList players={players} />
			</SportsSection>
		</SportsShell>
	)
}
