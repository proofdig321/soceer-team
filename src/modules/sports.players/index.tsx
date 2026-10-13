import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { Module } from '@/modules'
import Eyebrow from '@/ui/eyebrow'
import { PlayerCard } from '@/ui/sports'

const QUERY = groq`*[_type == 'sports.player' && team._ref == $teamId && publicProfile == true] | order(shirtNumber asc){
	_id, displayName, shirtNumber, position, squad
}`

async function getPlayers(teamId: string) {
	'use cache'
	return client
		.withConfig({ token, useCdn: true, perspective: 'published' })
		.fetch(QUERY, { teamId })
}

export default async function SportsPlayers({ teamId, eyebrow, ...props }: {
	teamId?: { _ref?: string }
	eyebrow?: string
	[key: string]: any
}) {
	const ref = teamId?._ref
	if (!ref) return null

	const players = await getPlayers(ref)

	return (
		<Module className="section space-y-6" {...props}>
			{eyebrow && <Eyebrow value={eyebrow} className="text-gold" />}
			{!players?.length ? (
				<p className="text-white/50 text-sm">No players available.</p>
			) : (
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{players.map((p: any) => (
						<PlayerCard
							key={p._id}
							displayName={p.displayName}
							shirtNumber={p.shirtNumber}
							position={p.position}
							squad={p.squad}
						/>
					))}
				</div>
			)}
		</Module>
	)
}
