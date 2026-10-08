import { notFound } from 'next/navigation'
import ModulesResolver from '@/modules'
import { sanityFetch } from '@/sanity/lib/live'
import { MODULES_QUERY } from '@/sanity/lib/queries'
import { groq } from 'next-sanity'
import { getTeam, getPlayers } from '@/lib/sports'

const TEAM_SLUG = 'unami-stars'

const PAGE_QUERY = groq`*[_type == 'page' && metadata.slug.current == 'stars/players'][0]{
	..., modules[]{ ${MODULES_QUERY} }
}`

export default async function StarsPlayers() {
	const [{ data: page }, team] = await Promise.all([
		sanityFetch({ query: PAGE_QUERY, perspective: 'published', stega: false }),
		getTeam(TEAM_SLUG),
	])

	if (!page) notFound()

	const players = team ? await getPlayers(team._id) : []

	return (
		<>
			<ModulesResolver page={page as any} perspective="published" stega={false} />

			{players.length > 0 && (
				<section className="section space-y-8 border-t">
					<header className="prose">
						<p className="eyebrow">Live Data · {players.length} Registered Players</p>
						<h2>Player Profiles</h2>
					</header>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{players.map((p) => (
							<article key={p._id} className="prose border rounded-lg p-6 space-y-2">
								<p className="eyebrow">{p.position} · #{p.shirtNumber} · {p.squad}</p>
								<h3 className="mt-0">{p.displayName}</h3>
								{p.introduction?.[0]?.children?.[0]?.text && (
									<p className="text-sm text-foreground/70">{p.introduction[0].children[0].text}</p>
								)}
							</article>
						))}
					</div>
				</section>
			)}
		</>
	)
}
