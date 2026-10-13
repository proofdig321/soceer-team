'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export default function Narrator({ script, label = 'Listen' }: { script: string; label?: string }) {
	const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle')
	const uttRef = useRef<SpeechSynthesisUtterance | null>(null)

	const stop = useCallback(() => {
		window.speechSynthesis?.cancel()
		setState('idle')
	}, [])

	useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

	const toggle = () => {
		if (!('speechSynthesis' in window)) return

		if (state === 'playing') {
			window.speechSynthesis.pause()
			setState('paused')
			return
		}

		if (state === 'paused') {
			window.speechSynthesis.resume()
			setState('playing')
			return
		}

		// idle — start fresh
		window.speechSynthesis.cancel()
		const utt = new SpeechSynthesisUtterance(script)
		utt.rate = 0.92
		utt.pitch = 1
		utt.lang = 'en-ZA'
		utt.onend = () => setState('idle')
		utt.onerror = () => setState('idle')
		uttRef.current = utt
		window.speechSynthesis.speak(utt)
		setState('playing')
	}

	const icon = state === 'playing' ? '⏸' : state === 'paused' ? '▶' : '🔊'
	const text = state === 'playing' ? 'Pause' : state === 'paused' ? 'Resume' : label

	return (
		<div className="flex items-center gap-2">
			<button
				onClick={toggle}
				aria-label={`${text} narration`}
				className="inline-flex items-center gap-2 rounded border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold transition-colors hover:bg-gold/20"
			>
				<span aria-hidden>{icon}</span>
				{text}
			</button>
			{state !== 'idle' && (
				<button
					onClick={stop}
					aria-label="Stop narration"
					className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white/50 transition-colors hover:text-white/80"
				>
					■ Stop
				</button>
			)}
		</div>
	)
}
