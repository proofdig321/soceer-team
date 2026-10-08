import { notFound } from 'next/navigation'
import ModulesResolver from '@/modules'
import { sanityFetch } from '@/sanity/lib/live'
import { MODULES_QUERY } from '@/sanity/lib/queries'
import { groq } from 'next-sanity'
import { getTeam, getEvents } from '@/lib/sports'

const TEAM_SLUG = 'unami-stars'

const PAGE_QUERY = groq`*[_type == 'page' && metadata.slug.current == 'stars/events'][0]{
	..., modules[]{ ${MODULES_QUERY} }
}`

function formatDateTime(iso: string) {
	return new Date(iso).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(iso: string) {
	return new Date(iso).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
}

const STATUS_LABELS: Record<string, string> = {
	proposed: 'Proposed', readiness: 'In Review', approved: 'Approved',
	scheduled: 'Scheduled', delivered: 'Delivered', cancelled: 'Cancelled', reviewed: 'Complete',
}

export default async function StarsEvents() {
	const [{ data: page }, team] = await Promise.all([
		sanityFetch({ query: PAGE_QUERY, perspective: 'published', stega: false }),
		getTeam(TEAM_SLUG),
	])

	if (!page) notFound()

	const events = team ? await getEvents(team._id) : []

	return (
		<>
			<ModulesResolver page={page as any} perspective="published" stega={false} />

			{events.length > 0 && (
				<section className="section space-y-8 border-t">
					<header className="prose">
						<p className="eyebrow">Live Events · {events.length} Listed</p>
						<h2>All Events</h2>
					</header>
					<div className="grid gap-6 sm:grid-cols-2">
						{events.map((e) => (
							<article key={e._id} className="border rounded-lg p-6 space-y-2">
								<div className="flex items-center justify-between gap-4">
									<p className="eyebrow text-xs">{STATUS_LABELS[e.status] ?? e.status}</p>
								</div>
								<h3 className="font-bold text-lg">{e.title}</h3>
								{e.startDateTime && (
									<p className="text-sm text-foreground/70">
										{formatDateTime(e.startDateTime)}
										{e.endDateTime && ` · ${formatTime(e.startDateTime)}–${formatTime(e.endDateTime)}`}
									</p>
								)}
								{e.publicVenueName && (
									<p className="text-sm text-foreground/70">📍 {e.publicVenueName}</p>
								)}
							</article>
						))}
					</div>
				</section>
			)}
		</>
	)
}
