/** Inline SVG pitch top-down view */
export function PitchGraphic({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 400 260"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden
		>
			{/* outer boundary */}
			<rect x="8" y="8" width="384" height="244" rx="4" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
			{/* halfway line */}
			<line x1="200" y1="8" x2="200" y2="252" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			{/* centre circle */}
			<circle cx="200" cy="130" r="36" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			<circle cx="200" cy="130" r="2" fill="white" fillOpacity="0.15" />
			{/* left penalty area */}
			<rect x="8" y="72" width="60" height="116" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			{/* left goal area */}
			<rect x="8" y="100" width="24" height="60" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			{/* left penalty spot */}
			<circle cx="52" cy="130" r="1.5" fill="white" fillOpacity="0.15" />
			{/* left penalty arc */}
			<path d="M68 108 A36 36 0 0 1 68 152" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			{/* right penalty area */}
			<rect x="332" y="72" width="60" height="116" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			{/* right goal area */}
			<rect x="368" y="100" width="24" height="60" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			{/* right penalty spot */}
			<circle cx="348" cy="130" r="1.5" fill="white" fillOpacity="0.15" />
			{/* right penalty arc */}
			<path d="M332 108 A36 36 0 0 0 332 152" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			{/* left goal */}
			<rect x="0" y="112" width="8" height="36" rx="1" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
			{/* right goal */}
			<rect x="392" y="112" width="8" height="36" rx="1" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
			{/* corner arcs */}
			<path d="M8 20 A12 12 0 0 1 20 8" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			<path d="M380 8 A12 12 0 0 1 392 20" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			<path d="M392 240 A12 12 0 0 1 380 252" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			<path d="M20 252 A12 12 0 0 1 8 240" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
			{/* gold accent — ball at centre */}
			<circle cx="200" cy="130" r="6" fill="#f3b942" fillOpacity="0.6" />
			<circle cx="200" cy="130" r="10" stroke="#f3b942" strokeOpacity="0.2" strokeWidth="1" />
		</svg>
	)
}

/** Hexagon grid background pattern */
export function HexPattern({ className }: { className?: string }) {
	return (
		<svg
			width="100%"
			height="100%"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden
		>
			<defs>
				<pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
					<polygon
						points="28,2 52,14 52,34 28,46 4,34 4,14"
						fill="none"
						stroke="white"
						strokeOpacity="0.04"
						strokeWidth="0.8"
					/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#hex)" />
		</svg>
	)
}

/** Diagonal gold beam */
export function GoldBeam({ className }: { className?: string }) {
	return (
		<div
			aria-hidden
			className={className}
			style={{
				background: 'linear-gradient(135deg, transparent 0%, rgba(243,185,66,0.06) 40%, rgba(243,185,66,0.12) 50%, rgba(243,185,66,0.06) 60%, transparent 100%)',
			}}
		/>
	)
}

/** Inline Unami Sports wordmark (text-only fallback) */
export function SportsBadge() {
	return (
		<div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/8 px-4 py-1.5">
			<span className="size-2 rounded-full bg-gold" />
			<span className="technical text-[11px] text-gold tracking-widest">UNAMI SPORTS</span>
		</div>
	)
}

/** Stat block */
export function StatBlock({ value, label, sub }: { value: string; label: string; sub?: string }) {
	return (
		<div className="flex flex-col gap-1 text-center">
			<span className="text-4xl font-black text-gold tabular-nums leading-none">{value}</span>
			<span className="text-sm font-semibold text-white">{label}</span>
			{sub && <span className="text-xs text-white/40">{sub}</span>}
		</div>
	)
}

/** Phase badge for roadmap */
export function PhaseBadge({ phase, active }: { phase: number; active?: boolean }) {
	return (
		<div className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-black tabular-nums transition-colors ${active ? 'border-gold bg-gold/20 text-gold' : 'border-white/15 bg-white/5 text-white/40'}`}>
			{phase}
		</div>
	)
}

/** Audience colour map */
export const AUDIENCE_COLOURS: Record<string, string> = {
	All:            'bg-white/10 text-white/60 border-white/15',
	'Community FA': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
	Funders:        'bg-blue-500/15 text-blue-300 border-blue-500/20',
	Governance:     'bg-orange-500/15 text-orange-300 border-orange-500/20',
	Commercial:     'bg-purple-500/15 text-purple-300 border-purple-500/20',
	Leadership:     'bg-gold/15 text-gold border-gold/20',
}

export function AudiencePill({ label }: { label: string }) {
	return (
		<span className={`technical inline-flex items-center rounded border px-2 py-0.5 text-[10px] ${AUDIENCE_COLOURS[label] ?? AUDIENCE_COLOURS.All}`}>
			{label}
		</span>
	)
}
