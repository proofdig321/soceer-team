import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { Module } from '@/modules'
import Eyebrow from '@/ui/eyebrow'
import { StatBar } from '@/ui/sports'

const QUERY = groq`*[
	_type == 'sports.fixture' &&
	team._ref == $teamId &&
	publicListing == true &&
	status == 'completed' &&
	($season == '' || season == $season)
] {
	homeScore, awayScore
}`

interface FixtureResult { homeScore?: number | null; awayScore?: number | null }

function computeStats(fixtures: FixtureResult[]) {
	let played = 0, won = 0, drawn = 0, lost = 0, gf = 0, ga = 0, cs = 0

	for (const f of fixtures) {
		const h = f.homeScore ?? 0
		const a = f.awayScore ?? 0
		played++
		gf += h
		ga += a
		if (h > a) won++
		else if (h === a) drawn++
		else lost++
		if (a === 0) cs++
	}

	const winRate = played > 0 ? Math.round((won / played) * 100) : 0

	return { played, won, drawn, lost, gf, ga, cs, winRate }
}

async function getFixtureResults(teamId: string, season: string) {
	'use cache'
	return client
		.withConfig({ token, useCdn: true, perspective: 'published' })
		.fetch(QUERY, { teamId, season })
}

export default async function SportsSeasonStats({ teamId, eyebrow, heading, season, ...props }: {
	teamId?: { _ref?: string }
	eyebrow?: string
	heading?: string
	season?: string
	[key: string]: any
}) {
	const ref = teamId?._ref
	if (!ref) return null

	const fixtures = await getFixtureResults(ref, season ?? '')
	if (!fixtures?.length) return null

	const stats = computeStats(fixtures)

	return (
		<Module className="section space-y-6" {...props}>
			{eyebrow && <Eyebrow value={eyebrow} className="text-gold" />}
			{heading && <h2 className="h3 text-white">{heading}</h2>}

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{/* Summary tiles */}
				{[
					{ label: 'Played',  value: stats.played },
					{ label: 'Won',     value: stats.won },
					{ label: 'Drawn',   value: stats.drawn },
					{ label: 'Lost',    value: stats.lost },
				].map(({ label, value }) => (
					<div key={label} className="flex flex-col gap-1 rounded-xl border border-white/10 bg-forest p-4">
						<span className="technical text-[10px] text-white/40">{label}</span>
						<span className="tabular-nums text-3xl font-black text-white">{value}</span>
					</div>
				))}
			</div>

			<div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-white/10 bg-forest p-5">
				<StatBar label="Win rate" value={`${stats.winRate}%`} percent={stats.winRate} accent="gold" />
				<StatBar label="Goals scored" value={stats.gf} percent={stats.played > 0 ? Math.min(100, (stats.gf / (stats.played * 5)) * 100) : 0} accent="emerald" />
				<StatBar label="Goals conceded" value={stats.ga} percent={stats.played > 0 ? Math.min(100, (stats.ga / (stats.played * 5)) * 100) : 0} accent="red" />
				<StatBar label="Clean sheets" value={stats.cs} percent={stats.played > 0 ? Math.round((stats.cs / stats.played) * 100) : 0} accent="blue" />
			</div>
		</Module>
	)
}
