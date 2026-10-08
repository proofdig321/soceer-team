import { notFound } from 'next/navigation'
import ModulesResolver from '@/modules'
import { sanityFetch } from '@/sanity/lib/live'
import { MODULES_QUERY } from '@/sanity/lib/queries'
import { groq } from 'next-sanity'
import { getTeam, getFixtures } from '@/lib/sports'

const TEAM_SLUG = 'unami-stars'

const PAGE_QUERY = groq`*[_type == 'page' && metadata.slug.current == 'stars/fixtures'][0]{
	..., modules[]{ ${MODULES_QUERY} }
}`

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(iso: string) {
	return new Date(iso).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
}

function result(f: { title: string; homeScore: number | null; awayScore: number | null; status: string }) {
	if (f.status !== 'completed' || f.homeScore == null || f.awayScore == null) return null
	const isHome = f.title.startsWith('Unami Stars')
	const us = isHome ? f.homeScore : f.awayScore
	const them = isHome ? f.awayScore : f.homeScore
	if (us > them) return { label: 'W', className: 'bg-green-600 text-white' }
	if (us === them) return { label: 'D', className: 'bg-yellow-500 text-white' }
	return { label: 'L', className: 'bg-red-600 text-white' }
}

export default async function StarsFixtures() {
	const [{ data: page }, team] = await Promise.all([
		sanityFetch({ query: PAGE_QUERY, perspective: 'published', stega: false }),
		getTeam(TEAM_SLUG),
	])

	if (!page) notFound()

	const fixtures = team ? await getFixtures(team._id) : []
	const completed = fixtures.filter((f) => f.status === 'completed')
	const scheduled = fixtures.filter((f) => f.status === 'scheduled')

	return (
		<>
			<ModulesResolver page={page as any} perspective="published" stega={false} />

			{fixtures.length > 0 && (
				<section className="section space-y-12 border-t">
					{completed.length > 0 && (
						<div className="space-y-6">
							<header className="prose">
								<p className="eyebrow">Live Results</p>
								<h2>Completed Fixtures</h2>
							</header>
							<div className="grid gap-4">
								{completed.map((f) => {
									const r = result(f)
									return (
										<article key={f._id} className="border rounded-lg p-6 grid gap-2 sm:grid-cols-[1fr_auto]">
											<div className="space-y-1">
												<p className="eyebrow text-xs">{formatDate(f.kickoff)} · {f.venue} · {f.competition}</p>
												<h3 className="font-bold text-lg">{f.title}</h3>
												{f.homeScore != null && f.awayScore != null && (
													<p className="text-2xl font-bold tabular-nums">{f.homeScore} – {f.awayScore}</p>
												)}
												{f.matchReport?.[0]?.children?.[0]?.text && (
													<p className="text-sm text-foreground/70 mt-2">{f.matchReport[0].children[0].text}</p>
												)}
											</div>
											{r && (
												<span className={`self-start rounded px-3 py-1 text-sm font-bold ${r.className}`}>{r.label}</span>
											)}
										</article>
									)
								})}
							</div>
						</div>
					)}

					{scheduled.length > 0 && (
						<div className="space-y-6">
							<header className="prose">
								<p className="eyebrow">Upcoming</p>
								<h2>Scheduled Fixtures</h2>
							</header>
							<div className="grid gap-4">
								{scheduled.map((f) => (
									<article key={f._id} className="border rounded-lg p-6 space-y-1">
										<p className="eyebrow text-xs">{formatDate(f.kickoff)} · {formatTime(f.kickoff)} · {f.venue}</p>
										<h3 className="font-bold text-lg">{f.title}</h3>
										<p className="text-sm text-foreground/70">{f.competition}</p>
									</article>
								))}
							</div>
						</div>
					)}
				</section>
			)}
		</>
	)
}
