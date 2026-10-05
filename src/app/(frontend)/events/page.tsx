import type { Metadata } from 'next'
import { getPublicSportsEvents } from '@/lib/sports-public'
import { EventList, SportsDirectoryPage } from '@/ui/sports/directory'

export const metadata: Metadata = {
	title: 'Events',
	description: 'Approved public Unami Sports events.',
}

export default async function EventsPage() {
	const events = await getPublicSportsEvents()

	return (
		<SportsDirectoryPage
			title="Events"
			intro="Listings appear only after the configured team, safety, first-aid, budget, venue and authority readiness checks are complete."
		>
			<EventList events={events} />
		</SportsDirectoryPage>
	)
}
