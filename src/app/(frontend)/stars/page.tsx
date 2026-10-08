import { notFound } from 'next/navigation'
import ModulesResolver from '@/modules'
import { sanityFetch } from '@/sanity/lib/live'
import { MODULES_QUERY } from '@/sanity/lib/queries'
import { groq } from 'next-sanity'
import { getTeam, getFixtures, getPlayers } from '@/lib/sports'

const TEAM_SLUG = 'unami-stars'

const PAGE_QUERY = groq`*[_type == 'page' && metadata.slug.current == 'stars'][0]{
	..., modules[]{ ${MODULES_QUERY} }
}`

export default async function StarsHome() {
	const [{ data: page }, team] = await Promise.all([
		sanityFetch({ query: PAGE_QUERY, perspective: 'published', stega: false }),
		getTeam(TEAM_SLUG),
	])

	if (!page) notFound()

	const [fixtures, players] = team
		? await Promise.all([getFixtures(team._id), getPlayers(team._id)])
		: [[], []]

	const won = fixtures.filter((f) => {
		const isHome = f.title.startsWith('Unami Stars')
		return f.status === 'completed' && (isHome ? (f.homeScore ?? 0) > (f.awayScore ?? 0) : (f.awayScore ?? 0) > (f.homeScore ?? 0))
	}).length
	const drawn = fixtures.filter((f) => f.status === 'completed' && f.homeScore === f.awayScore).length

	return (
		<>
			<ModulesResolver page={page as any} perspective="published" stega={false} />

			{team && (
				<section className="section space-y-8 border-t">
					<header className="prose">
						<p className="eyebrow">Live Data · {team.title}</p>
						<h2>Season at a Glance</h2>
					</header>
					<dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						{[
							{ value: String(players.length), label: 'Squad Players' },
							{ value: String(fixtures.filter((f) => f.status === 'completed').length), label: 'Fixtures Played' },
							{ value: `${won}W ${drawn}D ${fixtures.filter((f) => f.status === 'completed').length - won - drawn}L`, label: '2026 Form' },
							{ value: fixtures.some((f) => f.status === 'scheduled') ? 'Upcoming' : 'TBC', label: 'Next Match' },
						].map(({ value, label }) => (
							<div key={label}>
								<dt className="h0">{value}</dt>
								<dd className="prose mt-1">{label}</dd>
							</div>
						))}
					</dl>
				</section>
			)}
		</>
	)
}
