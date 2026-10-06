import type { Metadata } from 'next'
import { getPublicSportsFixtures } from '@/lib/sports-public'
import { SportsShell } from '@/ui/sports/primitives'
import { FixtureSplitList } from '@/ui/sports/components'

export const metadata: Metadata = {
	title: 'Fixtures and results',
	description: 'Approved public sports fixtures and completed results.',
}

export default async function FixturesPage() {
	const fixtures = await getPublicSportsFixtures()

	return (
		<SportsShell
			title="Fixtures and results"
			intro="Only approved listings for active public teams are shown. Private venues and match reports are not displayed."
			current="/fixtures"
		>
			<FixtureSplitList fixtures={fixtures} />
		</SportsShell>
	)
}
