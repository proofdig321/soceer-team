import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { Module } from '@/modules'
import Eyebrow from '@/ui/eyebrow'
import { PaginatedList } from '@/ui/pagination'
import { EventCard } from '@/ui/sports'

const QUERY = groq`*[_type == 'sports.event' && publicListing == true && (teams[]._ref match $teamId || count(teams) == 0)] | order(startDateTime asc){
	_id, title, status, startDateTime, endDateTime, publicVenueName
}`

async function getEvents(teamId: string) {
	'use cache'
	return client
		.withConfig({ token, useCdn: true, perspective: 'published' })
		.fetch(QUERY, { teamId })
}

export default async function SportsEvents({ teamId, eyebrow, ...props }: {
	teamId?: { _ref?: string }
	eyebrow?: string
	[key: string]: any
}) {
	const ref = teamId?._ref
	if (!ref) return null

	const events = await getEvents(ref)

	return (
		<Module className="section space-y-6" {...props}>
			{eyebrow && <Eyebrow value={eyebrow} className="text-gold" />}
			{!events?.length ? (
				<p className="text-white/50 text-sm">No events available.</p>
			) : (
				<PaginatedList
					items={events}
					itemsPerPage={9}
					gridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
					renderItem={(e: any) => (
						<EventCard
							key={e._id}
							title={e.title}
							startDateTime={e.startDateTime}
							endDateTime={e.endDateTime}
							publicVenueName={e.publicVenueName}
							status={e.status}
						/>
					)}
				/>
			)}
		</Module>
	)
}
