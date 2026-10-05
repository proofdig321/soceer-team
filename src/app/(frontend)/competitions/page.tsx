import type { Metadata } from 'next'
import { getPublicSportsCompetitions } from '@/lib/sports-public'
import { CompetitionList, SportsDirectoryPage } from '@/ui/sports/directory'

export const metadata: Metadata = {
	title: 'Competitions',
	description: 'Approved public Unami Sports competition announcements.',
}

export default async function CompetitionsPage() {
	const competitions = await getPublicSportsCompetitions()

	return (
		<SportsDirectoryPage
			title="Competitions"
			intro="Only announced competitions that meet the configured approval, authority, safeguarding and budget checks are listed."
		>
			<CompetitionList competitions={competitions} />
		</SportsDirectoryPage>
	)
}
