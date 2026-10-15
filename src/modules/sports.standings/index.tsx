import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { Module } from '@/modules'
import Eyebrow from '@/ui/eyebrow'
import { LeagueTable } from '@/ui/sports'
import type { StandingRow } from '@/ui/sports'

const QUERY = groq`*[
	_type == 'sports.standing' &&
	competition._ref == $competitionId
] | order(position asc) {
	position,
	teamName,
	"teamId": teamRef._ref,
	played, won, drawn, lost, goalsFor, goalsAgainst, points
}`

async function getStandings(competitionId: string): Promise<StandingRow[]> {
	'use cache'
	return client
		.withConfig({ token, useCdn: true, perspective: 'published' })
		.fetch(QUERY, { competitionId })
}

export default async function SportsStandings({ competitionId, highlightTeamId, eyebrow, heading, ...props }: {
	competitionId?: { _ref?: string }
	highlightTeamId?: { _ref?: string }
	eyebrow?: string
	heading?: string
	[key: string]: any
}) {
	const ref = competitionId?._ref
	if (!ref) return null

	const rows = await getStandings(ref)
	if (!rows?.length) return null

	return (
		<Module className="section space-y-6" {...props}>
			{eyebrow && <Eyebrow value={eyebrow} className="text-gold" />}
			{heading && <h2 className="h3 text-white">{heading}</h2>}
			<LeagueTable
				rows={rows}
				highlightTeamId={highlightTeamId?._ref ?? null}
			/>
		</Module>
	)
}
