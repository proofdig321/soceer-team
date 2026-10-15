import { cn } from '@/lib/utils'

export interface StandingRow {
	position: number
	teamName: string
	teamId?: string
	played: number
	won: number
	drawn: number
	lost: number
	goalsFor: number
	goalsAgainst: number
	points: number
}

export interface LeagueTableProps {
	rows: StandingRow[]
	/** _id of the home team — highlights that row */
	highlightTeamId?: string | null
	className?: string
}

export default function LeagueTable({ rows, highlightTeamId, className }: LeagueTableProps) {
	if (!rows.length) return null

	return (
		<div className={cn('overflow-x-auto rounded-xl border border-white/10', className)}>
			<table className="w-full text-xs">
				<thead>
					<tr className="border-b border-white/10 bg-white/[0.03]">
						<th className="technical px-3 py-2.5 text-left text-[10px] text-white/40 w-8">#</th>
						<th className="technical px-3 py-2.5 text-left text-[10px] text-white/40">Team</th>
						<th className="technical px-3 py-2.5 text-center text-[10px] text-white/40 tabular-nums">P</th>
						<th className="technical px-3 py-2.5 text-center text-[10px] text-white/40 tabular-nums">W</th>
						<th className="technical px-3 py-2.5 text-center text-[10px] text-white/40 tabular-nums">D</th>
						<th className="technical px-3 py-2.5 text-center text-[10px] text-white/40 tabular-nums">L</th>
						<th className="technical px-3 py-2.5 text-center text-[10px] text-white/40 tabular-nums">GD</th>
						<th className="technical px-3 py-2.5 text-center text-[10px] text-gold/80 tabular-nums">Pts</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => {
						const isHome = highlightTeamId && row.teamId === highlightTeamId
						const gd = row.goalsFor - row.goalsAgainst
						return (
							<tr
								key={row.teamId ?? i}
								className={cn(
									'border-b border-white/5 transition-colors last:border-0',
									isHome
										? 'bg-gold/8 text-white'
										: 'text-white/70 hover:bg-white/[0.02]',
								)}
							>
								<td className={cn('px-3 py-2.5 tabular-nums font-bold', isHome ? 'text-gold' : 'text-white/30')}>
									{row.position}
								</td>
								<td className={cn('px-3 py-2.5 font-semibold', isHome && 'text-white')}>
									{row.teamName}
									{isHome && <span className="ml-2 technical text-[9px] text-gold/60">YOU</span>}
								</td>
								<td className="px-3 py-2.5 text-center tabular-nums">{row.played}</td>
								<td className="px-3 py-2.5 text-center tabular-nums text-emerald-400/80">{row.won}</td>
								<td className="px-3 py-2.5 text-center tabular-nums">{row.drawn}</td>
								<td className="px-3 py-2.5 text-center tabular-nums text-red-400/70">{row.lost}</td>
								<td className={cn('px-3 py-2.5 text-center tabular-nums', gd > 0 ? 'text-emerald-400/80' : gd < 0 ? 'text-red-400/70' : '')}>
									{gd > 0 ? `+${gd}` : gd}
								</td>
								<td className={cn('px-3 py-2.5 text-center tabular-nums font-black', isHome ? 'text-gold' : 'text-white')}>
									{row.points}
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
