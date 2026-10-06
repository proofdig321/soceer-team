import type { Metadata } from 'next'
import { getPublicSportsTeams } from '@/lib/sports-public'
import { SportsShell } from '@/ui/sports/primitives'
import { TeamGrid } from '@/ui/sports/components'

export const metadata: Metadata = {
	title: 'Teams',
	description: 'Public profiles for active Unami Sports teams.',
}

export default async function TeamsPage() {
	const teams = await getPublicSportsTeams()

	return (
		<SportsShell
			title="Teams"
			intro="Only active, explicitly published, non-demonstration team profiles appear here."
			current="/teams"
		>
			<TeamGrid teams={teams} />
		</SportsShell>
	)
}
