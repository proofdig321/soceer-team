/** Full football pitch — top-down, much more visible */
export function PitchGraphic({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 560 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
			<defs>
				{/* grass stripe pattern */}
				<pattern id="grass" x="0" y="0" width="40" height="360" patternUnits="userSpaceOnUse">
					<rect x="0" y="0" width="20" height="360" fill="white" fillOpacity="0.025" />
				</pattern>
				{/* glow filter */}
				<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation="3" result="blur" />
					<feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
				</filter>
				<filter id="goldglow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="6" result="blur" />
					<feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
				</filter>
			</defs>

			{/* grass stripes */}
			<rect x="10" y="10" width="540" height="340" rx="4" fill="url(#grass)" />

			{/* outer boundary — bright */}
			<rect x="10" y="10" width="540" height="340" rx="4" stroke="white" strokeOpacity="0.55" strokeWidth="2" />

			{/* halfway line */}
			<line x1="280" y1="10" x2="280" y2="350" stroke="white" strokeOpacity="0.40" strokeWidth="1.5" />

			{/* centre circle */}
			<circle cx="280" cy="180" r="52" stroke="white" strokeOpacity="0.40" strokeWidth="1.5" />

			{/* centre spot */}
			<circle cx="280" cy="180" r="3" fill="white" fillOpacity="0.60" />

			{/* left penalty area */}
			<rect x="10" y="100" width="88" height="160" stroke="white" strokeOpacity="0.40" strokeWidth="1.5" />
			{/* left goal area */}
			<rect x="10" y="138" width="34" height="84" stroke="white" strokeOpacity="0.40" strokeWidth="1.5" />
			{/* left penalty spot */}
			<circle cx="76" cy="180" r="2.5" fill="white" fillOpacity="0.55" />
			{/* left penalty arc */}
			<path d="M98 148 A52 52 0 0 1 98 212" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />

			{/* right penalty area */}
			<rect x="462" y="100" width="88" height="160" stroke="white" strokeOpacity="0.40" strokeWidth="1.5" />
			{/* right goal area */}
			<rect x="516" y="138" width="34" height="84" stroke="white" strokeOpacity="0.40" strokeWidth="1.5" />
			{/* right penalty spot */}
			<circle cx="484" cy="180" r="2.5" fill="white" fillOpacity="0.55" />
			{/* right penalty arc */}
			<path d="M462 148 A52 52 0 0 0 462 212" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />

			{/* left goal */}
			<rect x="0" y="156" width="10" height="48" rx="1" fill="white" fillOpacity="0.10" stroke="white" strokeOpacity="0.55" strokeWidth="1.5" />
			{/* right goal */}
			<rect x="550" y="156" width="10" height="48" rx="1" fill="white" fillOpacity="0.10" stroke="white" strokeOpacity="0.55" strokeWidth="1.5" />

			{/* corner arcs */}
			<path d="M10 26 A16 16 0 0 1 26 10" stroke="white" strokeOpacity="0.40" strokeWidth="1.5" />
			<path d="M534 10 A16 16 0 0 1 550 26" stroke="white" strokeOpacity="0.40" strokeWidth="1.5" />
			<path d="M550 334 A16 16 0 0 1 534 350" stroke="white" strokeOpacity="0.40" strokeWidth="1.5" />
			<path d="M26 350 A16 16 0 0 1 10 334" stroke="white" strokeOpacity="0.40" strokeWidth="1.5" />

			{/* floodlight glow — four corners */}
			<circle cx="10"  cy="10"  r="18" fill="#f3b942" fillOpacity="0.06" />
			<circle cx="550" cy="10"  r="18" fill="#f3b942" fillOpacity="0.06" />
			<circle cx="10"  cy="350" r="18" fill="#f3b942" fillOpacity="0.06" />
			<circle cx="550" cy="350" r="18" fill="#f3b942" fillOpacity="0.06" />

			{/* gold ball at centre — glowing */}
			<circle cx="280" cy="180" r="14" fill="#f3b942" fillOpacity="0.15" filter="url(#goldglow)" />
			<circle cx="280" cy="180" r="8"  fill="#f3b942" fillOpacity="0.80" filter="url(#glow)" />
			{/* ball seam lines */}
			<path d="M274 174 Q280 180 274 186" stroke="#173426" strokeOpacity="0.6" strokeWidth="1" />
			<path d="M286 174 Q280 180 286 186" stroke="#173426" strokeOpacity="0.6" strokeWidth="1" />
		</svg>
	)
}

/** Hexagon grid background pattern */
export function HexPattern({ className }: { className?: string }) {
	return (
		<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
			<defs>
				<pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
					<polygon points="28,2 52,14 52,34 28,46 4,34 4,14" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="0.8" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#hex)" />
		</svg>
	)
}

/** Diagonal gold beam */
export function GoldBeam({ className }: { className?: string }) {
	return (
		<div aria-hidden className={className} style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(243,185,66,0.06) 40%, rgba(243,185,66,0.12) 50%, rgba(243,185,66,0.06) 60%, transparent 100%)' }} />
	)
}

/** Unami Sports badge pill */
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

/** Section 01 — Identity: three-layer stack diagram */
export function IdentityDiagram() {
	const layers = [
		{ label: 'Community Teams', sub: 'Sporting authority', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', w: '100%' },
		{ label: 'Unami Sports', sub: 'Infrastructure & support', color: 'rgba(243,185,66,0.12)', border: 'rgba(243,185,66,0.35)', w: '80%' },
		{ label: 'Unami Foundation', sub: 'Non-profit steward', color: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.15)', w: '60%' },
	]
	return (
		<div className="flex flex-col items-center gap-2 py-4">
			{layers.map(({ label, sub, color, border, w }) => (
				<div key={label} className="flex flex-col items-center justify-center rounded-lg py-3 px-4 text-center transition-all" style={{ width: w, background: color, border: `1px solid ${border}` }}>
					<span className="text-xs font-bold text-white">{label}</span>
					<span className="text-[10px] text-white/45 mt-0.5">{sub}</span>
				</div>
			))}
			<p className="technical text-[9px] text-white/25 mt-2 text-center">Programme structure</p>
		</div>
	)
}

/** Section 02 — Boundaries: real vs demo split */
export function RealVsDemoBar() {
	return (
		<div className="space-y-3 py-2">
			{[
				{ label: 'Infrastructure', real: true },
				{ label: 'CMS & schemas', real: true },
				{ label: 'Safeguarding gates', real: true },
				{ label: 'Sports components', real: true },
				{ label: 'Unami Stars team', real: false },
				{ label: 'Commercial partners', real: false },
				{ label: 'Registered league', real: false },
			].map(({ label, real }) => (
				<div key={label} className="flex items-center gap-3">
					<span className={`size-2 shrink-0 rounded-full ${real ? 'bg-emerald-400' : 'bg-orange-400/60'}`} />
					<span className="text-xs text-white/60 flex-1">{label}</span>
					<span className={`technical text-[9px] rounded px-1.5 py-0.5 ${real ? 'bg-emerald-500/15 text-emerald-300' : 'bg-orange-500/15 text-orange-300'}`}>
						{real ? 'REAL' : 'DEMO'}
					</span>
				</div>
			))}
			<p className="technical text-[9px] text-white/25 mt-3 text-center">Current programme status</p>
		</div>
	)
}

/** Section 04 — Funders: theory of change flow */
export function TheoryOfChange() {
	const steps = ['Donated infrastructure', 'Less admin burden', 'More time on sport', 'Community impact']
	return (
		<div className="flex flex-col gap-1 py-2">
			{steps.map((step, i) => (
				<div key={step} className="flex flex-col items-center">
					<div className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-center">
						<span className="text-xs text-white/70">{step}</span>
					</div>
					{i < steps.length - 1 && (
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="my-0.5 shrink-0">
							<path d="M8 3v10M4 9l4 4 4-4" stroke="#f3b942" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
					)}
				</div>
			))}
			<p className="technical text-[9px] text-white/25 mt-2 text-center">Theory of change</p>
		</div>
	)
}

/** Section 05 — Governance: shield with layers */
export function SafeguardingShield() {
	return (
		<svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 mx-auto" aria-hidden>
			<defs>
				<filter id="shieldglow">
					<feGaussianBlur stdDeviation="4" result="blur" />
					<feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
				</filter>
			</defs>
			{/* shield outer */}
			<path d="M60 8 L104 28 L104 72 Q104 108 60 128 Q16 108 16 72 L16 28 Z" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.35)" strokeWidth="1.5" filter="url(#shieldglow)" />
			{/* shield inner */}
			<path d="M60 22 L92 38 L92 70 Q92 98 60 114 Q28 98 28 70 L28 38 Z" fill="rgba(249,115,22,0.05)" stroke="rgba(249,115,22,0.20)" strokeWidth="1" />
			{/* lock icon */}
			<rect x="48" y="68" width="24" height="18" rx="3" fill="rgba(249,115,22,0.25)" stroke="rgba(249,115,22,0.6)" strokeWidth="1.5" />
			<path d="M52 68 L52 62 Q52 54 60 54 Q68 54 68 62 L68 68" stroke="rgba(249,115,22,0.6)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
			<circle cx="60" cy="77" r="2.5" fill="rgba(249,115,22,0.8)" />
			{/* GATE label */}
			<text x="60" y="100" textAnchor="middle" fill="rgba(249,115,22,0.5)" fontSize="7" fontFamily="monospace" letterSpacing="2">GATE</text>
		</svg>
	)
}

/** Section 06 — Commercial: firewall diagram */
export function FirewallDiagram() {
	return (
		<div className="space-y-2 py-2">
			<div className="rounded-lg border border-purple-500/20 bg-purple-500/8 px-3 py-2.5 text-center">
				<span className="text-xs font-semibold text-purple-300">Commercial Partner</span>
			</div>
			<div className="flex items-center gap-2">
				<div className="h-px flex-1 bg-white/10" />
				<div className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1">
					<span className="technical text-[9px] text-red-300">FIREWALL</span>
				</div>
				<div className="h-px flex-1 bg-white/10" />
			</div>
			{['Recognition only', 'Written agreement', 'Transparent reporting'].map(item => (
				<div key={item} className="flex items-center gap-2 rounded border border-white/8 bg-white/[0.03] px-3 py-2">
					<span className="size-1.5 rounded-full bg-gold/60 shrink-0" />
					<span className="text-xs text-white/55">{item}</span>
				</div>
			))}
			<div className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-3 py-2.5 text-center">
				<span className="text-xs font-semibold text-emerald-300">Community Programme</span>
			</div>
			<p className="technical text-[9px] text-white/25 text-center">Commercial firewall</p>
		</div>
	)
}

/** Section 09 — Live demo: platform stack */
export function PlatformStack() {
	const layers = [
		{ label: 'Vercel Edge', sub: 'Deployment & CDN', color: 'rgba(255,255,255,0.06)' },
		{ label: 'Next.js 16', sub: 'App Router + Server Components', color: 'rgba(255,255,255,0.05)' },
		{ label: 'Sanity CMS', sub: 'Content + safeguarding workflow', color: 'rgba(243,185,66,0.08)' },
		{ label: 'Sports UI', sub: 'Fixtures · Players · Events', color: 'rgba(16,185,129,0.06)' },
	]
	return (
		<div className="flex flex-col gap-1.5 py-2">
			{layers.map(({ label, sub, color }) => (
				<div key={label} className="flex items-center gap-3 rounded-lg border border-white/8 px-3 py-2.5" style={{ background: color }}>
					<div className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
					<div>
						<p className="text-xs font-semibold text-white">{label}</p>
						<p className="text-[10px] text-white/40">{sub}</p>
					</div>
				</div>
			))}
			<p className="technical text-[9px] text-white/25 mt-1 text-center">Live platform stack</p>
		</div>
	)
}
