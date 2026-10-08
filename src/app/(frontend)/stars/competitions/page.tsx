import { notFound } from 'next/navigation'
import ModulesResolver from '@/modules'
import { sanityFetch } from '@/sanity/lib/live'
import { MODULES_QUERY } from '@/sanity/lib/queries'
import { groq } from 'next-sanity'
import { getTeam, getCompetitions, getFixtures } from '@/lib/sports'

const TEAM_SLUG = 'unami-stars'

const PAGE_QUERY = groq`*[_type == 'page' && metadata.slug.current == 'stars/competitions'][0]{
	..., modules[]{ ${MODULES_QUERY} }
}`

const FORMAT_LABELS: Record<string, string> = {
	tournament: 'Tournament', league: 'Development League', festival: 'Festival / Jamboree',
}

const STATUS_LABELS: Record<string, string> = {
	concept: 'Concept', feasibility: 'Feasibility', approval: 'Approval Pending',
	approved: 'Approved', active: 'Active', completed: 'Completed', paused: 'Paused', cancelled: 'Cancelled',
}

export default async function StarsCompetitions() {
	const [{ data: page }, team] = await Promise.all([
		sanityFetch({ query: PAGE_QUERY, perspective: 'published', stega: false }),
		getTeam(TEAM_SLUG),
	])

	if (!page) notFound()

	const [competitions, fixtures] = team
		? await Promise.all([getCompetitions(team._id), getFixtures(team._id)])
		: [[], []]

	return (
		<>
			<ModulesResolver page={page as any} perspective="published" stega={false} />

			{competitions.length > 0 && (
				<section className="section space-y-8 border-t">
					<header className="prose">
						<p className="eyebrow">Live Data · {competitions.length} Competition{competitions.length !== 1 ? 's' : ''}</p>
						<h2>Active Competitions</h2>
					</header>

					{competitions.map((comp) => {
						const compFixtures = fixtures.filter((f) => f.competition === comp.title)
						const played = compFixtures.filter((f) => f.status === 'completed')
						const goalsFor = played.reduce((sum, f) => {
							const isHome = f.title.startsWith('Unami Stars')
							return sum + (isHome ? (f.homeScore ?? 0) : (f.awayScore ?? 0))
						}, 0)
						const goalsAgainst = played.reduce((sum, f) => {
							const isHome = f.title.startsWith('Unami Stars')
							return sum + (isHome ? (f.awayScore ?? 0) : (f.homeScore ?? 0))
						}, 0)
						const points = played.reduce((sum, f) => {
							const isHome = f.title.startsWith('Unami Stars')
							const us = isHome ? (f.homeScore ?? 0) : (f.awayScore ?? 0)
							const them = isHome ? (f.awayScore ?? 0) : (f.homeScore ?? 0)
							return sum + (us > them ? 3 : us === them ? 1 : 0)
						}, 0)

						return (
							<article key={comp._id} className="border rounded-lg p-6 space-y-6">
								<div className="space-y-1">
									<div className="flex flex-wrap items-center gap-3">
										<span className="eyebrow text-xs">{FORMAT_LABELS[comp.format] ?? comp.format}</span>
										<span className="rounded bg-foreground/10 px-2 py-0.5 text-xs font-medium">{STATUS_LABELS[comp.status] ?? comp.status}</span>
									</div>
									<h3 className="font-bold text-xl">{comp.title}</h3>
									{comp.startDate && (
										<p className="text-sm text-foreground/70">{comp.startDate} – {comp.endDate ?? 'TBC'}</p>
									)}
									{comp.rulesSummary?.[0]?.children?.[0]?.text && (
										<p className="text-sm text-foreground/70 mt-2">{comp.rulesSummary[0].children[0].text}</p>
									)}
								</div>

								{played.length > 0 && (
									<div>
										<p className="eyebrow text-xs mb-3">Unami Stars Standing</p>
										<dl className="grid grid-cols-3 gap-4 sm:grid-cols-6">
											{[
												{ value: String(played.length), label: 'Played' },
												{ value: String(points), label: 'Points' },
												{ value: String(goalsFor), label: 'Goals For' },
												{ value: String(goalsAgainst), label: 'Goals Against' },
												{ value: `${goalsFor - goalsAgainst > 0 ? '+' : ''}${goalsFor - goalsAgainst}`, label: 'GD' },
											].map(({ value, label }) => (
												<div key={label} className="text-center">
													<dt className="text-2xl font-bold">{value}</dt>
													<dd className="text-xs text-foreground/60 mt-1">{label}</dd>
												</div>
											))}
										</dl>
									</div>
								)}
							</article>
						)
					})}
				</section>
			)}
		</>
	)
}
