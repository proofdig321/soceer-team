'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import ScoreBadge from './score-badge'
import StatusPill from './status-pill'

export interface NextFixtureBannerProps {
	title: string
	opponent: string
	kickoff?: string | null
	venue?: string | null
	status?: string
	homeScore?: number | null
	awayScore?: number | null
	competition?: string | null
	className?: string
}

function useCountdown(kickoff?: string | null) {
	const [parts, setParts] = useState<{ d: number; h: number; m: number; s: number } | null>(null)

	useEffect(() => {
		if (!kickoff) return
		const target = new Date(kickoff).getTime()

		function tick() {
			const diff = target - Date.now()
			if (diff <= 0) { setParts(null); return }
			const d = Math.floor(diff / 86400000)
			const h = Math.floor((diff % 86400000) / 3600000)
			const m = Math.floor((diff % 3600000) / 60000)
			const s = Math.floor((diff % 60000) / 1000)
			setParts({ d, h, m, s })
		}

		tick()
		const id = setInterval(tick, 1000)
		return () => clearInterval(id)
	}, [kickoff])

	return parts
}

function Digit({ value, label }: { value: number; label: string }) {
	return (
		<div className="flex flex-col items-center gap-0.5">
			<span className="tabular-nums text-3xl font-black leading-none text-white md:text-4xl">
				{String(value).padStart(2, '0')}
			</span>
			<span className="technical text-[9px] text-white/40">{label}</span>
		</div>
	)
}

export default function NextFixtureBanner({
	title,
	opponent,
	kickoff,
	venue,
	status = 'scheduled',
	homeScore,
	awayScore,
	competition,
	className,
}: NextFixtureBannerProps) {
	const countdown = useCountdown(status === 'scheduled' ? kickoff : null)
	const isCompleted = status === 'completed'
	const isLive = status === 'live'

	const kickoffDate = kickoff
		? new Date(kickoff).toLocaleDateString('en-ZA', {
				weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
		  })
		: null
	const kickoffTime = kickoff
		? new Date(kickoff).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
		: null

	return (
		<div className={cn(
			'relative overflow-hidden rounded-2xl border border-white/10 bg-forest-mid',
			className,
		)}>
			{/* Pitch texture */}
			<div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.03]"
				style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,1) 39px, rgba(255,255,255,1) 40px)' }}
			/>
			<div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

			<div className="relative flex flex-col gap-6 p-6 md:p-8">
				{/* Header row */}
				<div className="flex items-center justify-between gap-3">
					{competition && (
						<span className="technical text-[10px] text-gold/60">{competition}</span>
					)}
					<StatusPill status={status} className="ml-auto" />
				</div>

				{/* VS block */}
				<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
					<div className="flex flex-col gap-1">
						<span className="technical text-[9px] text-gold/50">HOME</span>
						<p className="text-base font-black text-white leading-tight md:text-xl">{title}</p>
					</div>

					<div className="flex flex-col items-center gap-2">
						{isCompleted || isLive ? (
							<ScoreBadge home={homeScore} away={awayScore} />
						) : (
							<span className="text-2xl font-black text-white/20 tracking-widest">VS</span>
						)}
						{isLive && (
							<span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
								<span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
								LIVE
							</span>
						)}
					</div>

					<div className="flex flex-col items-end gap-1">
						<span className="technical text-[9px] text-white/30">AWAY</span>
						<p className="text-base font-black text-white/80 leading-tight text-right md:text-xl">{opponent}</p>
					</div>
				</div>

				{/* Countdown or date */}
				{countdown ? (
					<div className="flex items-center justify-center gap-6 border-t border-white/5 pt-5">
						<Digit value={countdown.d} label="DAYS" />
						<span className="text-2xl font-black text-white/20 -mt-3">:</span>
						<Digit value={countdown.h} label="HRS" />
						<span className="text-2xl font-black text-white/20 -mt-3">:</span>
						<Digit value={countdown.m} label="MIN" />
						<span className="text-2xl font-black text-white/20 -mt-3">:</span>
						<Digit value={countdown.s} label="SEC" />
					</div>
				) : kickoffDate ? (
					<div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/5 pt-5 text-xs text-white/40">
						<span>{kickoffDate}</span>
						{kickoffTime && <><span className="text-white/20">·</span><span>{kickoffTime}</span></>}
						{venue && <><span className="text-white/20">·</span><span>{venue}</span></>}
					</div>
				) : null}
			</div>
		</div>
	)
}
