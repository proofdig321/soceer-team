import type { Metadata } from 'next'
import { getPublicSportsCompetitions } from '@/lib/sports-public'
import { SportsShell } from '@/ui/sports/primitives'
import { CompetitionList } from '@/ui/sports/components'

export const metadata: Metadata = {
	title: 'Competitions',
	description: 'Approved public Unami Sports competition announcements.',
}

export default async function CompetitionsPage() {
	const competitions = await getPublicSportsCompetitions()

	return (
		<SportsShell
			title="Competitions"
			intro="Only announced competitions that meet the configured approval, authority, safeguarding and budget checks are listed."
			current="/competitions"
		>
			<CompetitionList competitions={competitions} />
		</SportsShell>
	)
}
