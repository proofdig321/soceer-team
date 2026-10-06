'use client'

import { useEffect, useState } from 'react'
import type { Countdown } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Eyebrow from '@/ui/eyebrow'

function getTimeLeft(target: string) {
	const diff = new Date(target).getTime() - Date.now()
	if (diff <= 0) return null
	const d = Math.floor(diff / 86400000)
	const h = Math.floor((diff % 86400000) / 3600000)
	const m = Math.floor((diff % 3600000) / 60000)
	const s = Math.floor((diff % 60000) / 1000)
	return { d, h, m, s }
}

function Unit({ value, label }: { value: number; label: string }) {
	return (
		<div className="grid place-items-center gap-1">
			<span className="h0 tabular-nums">{String(value).padStart(2, '0')}</span>
			<span className="technical text-xs text-foreground/50">{label}</span>
		</div>
	)
}

export default function ({
	eyebrow,
	label,
	targetDate,
	ctas,
	_key,
	_type,
	attributes,
	...props
}: Countdown & { _key?: string; _type?: string; attributes?: unknown }) {
	const [time, setTime] = useState(() => (targetDate ? getTimeLeft(targetDate) : null))

	useEffect(() => {
		if (!targetDate) return
		const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000)
		return () => clearInterval(id)
	}, [targetDate])

	return (
		<section
			id={_key ? `module-${_key}` : undefined}
			data-module="countdown"
			className="section grid place-items-center gap-8 text-center"
			{...props}
		>
			<header className="grid gap-2">
				<Eyebrow value={eyebrow} />
				{label && <p className="h3">{label}</p>}
			</header>

			{time ? (
				<div className="flex flex-wrap items-end justify-center gap-6 md:gap-10">
					<Unit value={time.d} label="Days" />
					<span className="h1 pb-6 text-foreground/20">:</span>
					<Unit value={time.h} label="Hours" />
					<span className="h1 pb-6 text-foreground/20">:</span>
					<Unit value={time.m} label="Minutes" />
					<span className="h1 pb-6 text-foreground/20">:</span>
					<Unit value={time.s} label="Seconds" />
				</div>
			) : (
				<p className="h2 text-foreground/40">Event has passed</p>
			)}

			<CTAList ctas={ctas} className="justify-center max-sm:*:w-full" />
		</section>
	)
}
