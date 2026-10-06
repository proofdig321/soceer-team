import type { Metadata } from 'next'
import { getPublicSportsEvents } from '@/lib/sports-public'
import { SportsShell } from '@/ui/sports/primitives'
import { EventList } from '@/ui/sports/components'

export const metadata: Metadata = {
	title: 'Events',
	description: 'Approved public Unami Sports events.',
}

export default async function EventsPage() {
	const events = await getPublicSportsEvents()

	return (
		<SportsShell
			title="Events"
			intro="Listings appear only after team, safety, first-aid, budget, venue and authority readiness checks are complete."
			current="/events"
		>
			<EventList events={events} />
		</SportsShell>
	)
}
