'use client'

import { useCallback, useEffect, useState } from 'react'
import { set, unset } from 'sanity'
import type { StringInputProps, SanityDocument } from 'sanity'
import { useFormValue } from 'sanity'

interface PaletteSwatch {
	background: string
	foreground: string
	population: number
	title: string
}

interface Palette {
	dominant?: PaletteSwatch
	vibrant?: PaletteSwatch
	darkVibrant?: PaletteSwatch
	lightVibrant?: PaletteSwatch
	muted?: PaletteSwatch
	darkMuted?: PaletteSwatch
}

function isValidHex(v: string) {
	return /^#[0-9a-fA-F]{6}$/.test(v)
}

export default function BrandColourInput(props: StringInputProps) {
	const { value, onChange, elementProps } = props
	const doc = useFormValue([]) as SanityDocument & {
		logo?: { asset?: { _ref?: string } }
	}

	const [palette, setPalette] = useState<Palette | null>(null)
	const [loading, setLoading] = useState(false)
	const [inputVal, setInputVal] = useState(value ?? '')

	const logoRef = doc?.logo?.asset?._ref

	useEffect(() => {
		setInputVal(value ?? '')
	}, [value])

	useEffect(() => {
		if (!logoRef) { setPalette(null); return }

		// Sanity image ref format: image-{id}-{dims}-{ext}
		const match = logoRef.match(/^image-([a-f0-9]+)-/)
		if (!match) return

		const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
		const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
		if (!projectId) return

		setLoading(true)
		fetch(
			`https://cdn.sanity.io/images/${projectId}/${dataset}/${match[1]}.png?palette=dominant,vibrant,darkVibrant,lightVibrant,muted,darkMuted`,
		)
			.then((r) => {
				// Sanity palette is returned as JSON when ?palette= is used
				// Actually we need the metadata endpoint
				return fetch(
					`https://${projectId}.api.sanity.io/v2021-10-21/data/query/production?query=*[_id=="${logoRef}"][0]{metadata{palette}}`,
				)
			})
			.then((r) => r.json())
			.then((data) => {
				const p = data?.result?.metadata?.palette
				if (p) setPalette(p)
			})
			.catch(() => {})
			.finally(() => setLoading(false))
	}, [logoRef])

	const handlePick = useCallback(
		(hex: string) => {
			setInputVal(hex)
			onChange(set(hex))
		},
		[onChange],
	)

	const handleTextChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const v = e.target.value
			setInputVal(v)
			if (!v) {
				onChange(unset())
			} else if (isValidHex(v)) {
				onChange(set(v))
			}
		},
		[onChange],
	)

	const swatches = palette
		? Object.entries(palette)
				.filter(([, s]) => s?.background)
				.map(([key, s]) => ({ key, hex: s!.background, title: key }))
		: []

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				<input
					{...elementProps}
					type="text"
					value={inputVal}
					onChange={handleTextChange}
					placeholder="#f3b942"
					style={{
						fontFamily: 'monospace',
						padding: '6px 10px',
						border: '1px solid var(--card-border-color)',
						borderRadius: 4,
						background: 'var(--card-bg-color)',
						color: 'var(--card-fg-color)',
						width: 120,
					}}
				/>
				{value && isValidHex(value) && (
					<div
						style={{
							width: 28,
							height: 28,
							borderRadius: 4,
							background: value,
							border: '1px solid rgba(0,0,0,0.15)',
							flexShrink: 0,
						}}
						title={value}
					/>
				)}
			</div>

			{!logoRef && (
				<p style={{ fontSize: 12, color: 'var(--card-muted-fg-color)', margin: 0 }}>
					Upload a team logo above to get colour suggestions.
				</p>
			)}

			{logoRef && loading && (
				<p style={{ fontSize: 12, color: 'var(--card-muted-fg-color)', margin: 0 }}>
					Reading logo palette…
				</p>
			)}

			{swatches.length > 0 && (
				<div>
					<p style={{ fontSize: 11, color: 'var(--card-muted-fg-color)', margin: '0 0 6px' }}>
						Suggested from logo — click to use:
					</p>
					<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
						{swatches.map(({ key, hex, title }) => (
							<button
								key={key}
								type="button"
								title={`${title}: ${hex}`}
								onClick={() => handlePick(hex)}
								style={{
									width: 32,
									height: 32,
									borderRadius: 4,
									background: hex,
									border: value === hex ? '2px solid var(--card-fg-color)' : '1px solid rgba(0,0,0,0.15)',
									cursor: 'pointer',
									flexShrink: 0,
								}}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
