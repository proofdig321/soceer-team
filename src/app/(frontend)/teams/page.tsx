import type { Metadata } from 'next'
import { getPublicSportsTeams } from '@/lib/sports-public'
import { SportsDirectoryPage, TeamCards } from '@/ui/sports/directory'

export const metadata: Metadata = {
	title: 'Teams',
	description: 'Public profiles for active Unami Sports teams.',
}

export default async function TeamsPage() {
	const teams = await getPublicSportsTeams()

	return (
		<SportsDirectoryPage
			title="Teams"
			intro="Only active, explicitly published, non-demonstration team profiles appear here."
		>
			<TeamCards teams={teams} />
		</SportsDirectoryPage>
	)
}
