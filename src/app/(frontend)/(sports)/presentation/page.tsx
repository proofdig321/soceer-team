import type { Metadata } from 'next'
import Img from '@/ui/img'
import Narrator from '@/ui/narrator'
import { SCRIPTS } from './scripts'
import {
	PitchGraphic,
	HexPattern,
	GoldBeam,
	SportsBadge,
	StatBlock,
	PhaseBadge,
	AudiencePill,
	AUDIENCE_COLOURS,
	IdentityDiagram,
	RealVsDemoBar,
	TheoryOfChange,
	SafeguardingShield,
	FirewallDiagram,
	PlatformStack,
} from './visuals'

export const metadata: Metadata = {
	title: 'Programme Presentation — Unami Sports',
	description: 'A comprehensive overview of the Unami Sports programme for all stakeholders.',
	robots: { index: false },
}

const SPORTS_LOGO = 'image-ad2716a1593b8e8962104698b949523c0feed5d2-640x154-webp'
const STARS_LOGO  = 'image-4b032d9ebd368d50b7d0a808aaa020dd0438dd61-640x154-webp'
const logoImg = (ref: string) => ({ _type: 'image' as const, asset: { _type: 'reference' as const, _ref: ref } })

function Section({
	id, eyebrow, title, audiences, scriptKey, accent, graphic, children,
}: {
	id: string
	eyebrow: string
	title: string
	audiences: string[]
	scriptKey: keyof typeof SCRIPTS
	accent?: string
	graphic?: React.ReactNode
	children: React.ReactNode
}) {
	return (
		<section id={id} className="relative border-b border-white/8 py-20 scroll-mt-24 overflow-hidden" aria-labelledby={`${id}-heading`}>
			{accent && <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-30" style={{ background: accent }} />}
			<div className="section py-0 grid gap-10 lg:grid-cols-[1fr_2fr]">
				<div className="flex flex-col gap-4 lg:pt-1">
					<p className="technical text-xs text-gold/70">{eyebrow}</p>
					<h2 id={`${id}-heading`} className="h3 text-white text-balance leading-tight">{title}</h2>
					<div className="flex flex-wrap gap-2">{audiences.map(a => <AudiencePill key={a} label={a} />)}</div>
					<div className="mt-2"><Narrator script={SCRIPTS[scriptKey]} label="Listen" /></div>
					{graphic && <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-4">{graphic}</div>}
				</div>
				<div className="prose text-white/80 text-[0.95rem] leading-relaxed">{children}</div>
			</div>
		</section>
	)
}

function Divider({ label }: { label: string }) {
	return (
		<div className="section py-0 flex items-center gap-4 py-8">
			<div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
			<span className="technical text-[10px] text-white/30">{label}</span>
			<div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
		</div>
	)
}

function Card({ title, body, accent }: { title: string; body: string; accent?: boolean }) {
	return (
		<div className={`rounded-xl border p-4 ${accent ? 'border-gold/20 bg-gold/8' : 'border-white/8 bg-white/[0.03]'}`}>
			<p className={`text-sm font-semibold mb-1.5 ${accent ? 'text-gold' : 'text-white'}`}>{title}</p>
			<p className="text-xs text-white/55 leading-relaxed">{body}</p>
		</div>
	)
}

export default function PresentationPage() {
	return (
		<div className="bg-forest min-h-screen text-white">

			{/* ── HERO ─────────────────────────────────────────────────────── */}
			<header className="relative overflow-hidden border-b border-white/8">
				{/* backgrounds */}
				<HexPattern className="pointer-events-none absolute inset-0 opacity-100" />
				<GoldBeam className="pointer-events-none absolute inset-0" />
				<div aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forest to-transparent" />

				{/* pitch graphic — right side, much larger and more visible */}
				<div aria-hidden className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 w-[680px] max-lg:hidden">
					<PitchGraphic className="w-full drop-shadow-[0_0_80px_rgba(243,185,66,0.15)]" />
				</div>
				{/* mobile pitch — bottom */}
				<div aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0 opacity-20 lg:hidden">
					<PitchGraphic className="w-full" />
				</div>

				<div className="section relative z-10 pb-20 pt-24">
					{/* logos */}
					<div className="mb-8 flex flex-wrap items-center gap-6">
						<Img image={logoImg(SPORTS_LOGO)} width={160} className="h-9 w-auto object-contain" alt="Unami Sports" />
						<div className="h-6 w-px bg-white/15" aria-hidden />
						<Img image={logoImg(STARS_LOGO)} width={140} className="h-8 w-auto object-contain opacity-70" alt="Unami Stars" />
					</div>

					<SportsBadge />

					<h1 className="h0 mt-6 mb-6 max-w-3xl text-balance text-white">
						Building community sport infrastructure that lasts.
					</h1>
					<p className="text-lg text-white/60 leading-relaxed max-w-2xl mb-8">
						For community FAs, funders, governance reviewers, commercial partners, and programme leadership. Every section has a voice narrator. Every claim is honest about what exists today, what is proposed, and what still needs to be decided.
					</p>

					<div className="flex flex-wrap items-center gap-4 mb-12">
						<Narrator script={SCRIPTS.opening} label="Listen to introduction" />
						<a href="#what-we-are" className="text-sm text-white/40 hover:text-white transition-colors">
							Skip to content ↓
						</a>
					</div>

					{/* stats row */}
					<div className="grid grid-cols-2 gap-6 sm:grid-cols-4 max-w-2xl">
						<StatBlock value="1" label="Pilot team" sub="Unami Stars (demo)" />
						<StatBlock value="8" label="Roadmap phases" sub="Staged & gated" />
						<StatBlock value="10" label="Decisions" sub="Leadership required" />
						<StatBlock value="100%" label="Non-profit" sub="Unami Foundation" />
					</div>

					{/* audience key */}
					<div className="mt-10 flex flex-wrap gap-2 items-center">
						<span className="text-xs text-white/30 mr-1">Sections tagged for:</span>
						{Object.keys(AUDIENCE_COLOURS).map(a => <AudiencePill key={a} label={a} />)}
					</div>
				</div>
			</header>

			{/* ── STICKY NAV ───────────────────────────────────────────────── */}
			<nav aria-label="Presentation sections" className="sticky top-0 z-20 border-b border-white/8 bg-forest/95 backdrop-blur-md">
				<div className="section py-0 overflow-x-auto no-scrollbar">
					<ul className="flex gap-6 py-3 text-xs text-white/50 whitespace-nowrap">
						{[
							['#what-we-are',    '01 Identity'],
							['#what-we-are-not','02 Boundaries'],
							['#for-community',  '03 Community FAs'],
							['#for-funders',    '04 Funders'],
							['#for-governance', '05 Governance'],
							['#for-commercial', '06 Commercial'],
							['#for-leadership', '07 Leadership'],
							['#roadmap',        '08 Roadmap'],
							['#live-demo',      '09 Live demo'],
							['#decisions',      '10 Next steps'],
						].map(([href, label]) => (
							<li key={href}>
								<a href={href} className="hover:text-gold transition-colors">{label}</a>
							</li>
						))}
					</ul>
				</div>
			</nav>

			{/* ── 01 WHAT WE ARE ───────────────────────────────────────────── */}
			<Section
				id="what-we-are"
				eyebrow="01 — Identity"
				title="What Unami Sports is"
				audiences={['All']}
				scriptKey="whatWeAre"
				accent="radial-gradient(ellipse at right, rgba(243,185,66,0.08), transparent 70%)"
				graphic={<IdentityDiagram />}
			>
				<p>Unami Sports is a <strong className="text-white">community sport enablement programme</strong> run by Unami Foundation. We are not a football club, a governing body, a league, or a commercial sports business.</p>
				<p>We are a <strong className="text-white">non-profit-led operating partner</strong> — we donate and maintain digital infrastructure, train community administrators, coordinate stakeholder relationships where agreed, and support teams to manage their own sporting affairs.</p>
				<p>The technology is a tool. The programme is the people, the relationships, the governance, and the ongoing service.</p>
				<div className="not-prose mt-6 grid gap-3 sm:grid-cols-2">
					{[
						['Non-profit steward', 'Unami Foundation governs the programme, its resources, and its partner relationships.'],
						['Operating partner', 'We provide infrastructure and support. Teams retain their sporting authority.'],
						['Technology for good', 'Digital tools that reduce administrative burden — not a product to be sold.'],
						['Community-first', 'Every decision starts with what the community team needs and controls.'],
					].map(([t, b]) => <Card key={t} title={t} body={b} />)}
				</div>
			</Section>

			{/* ── 02 WHAT WE ARE NOT ───────────────────────────────────────── */}
			<Section
				id="what-we-are-not"
				eyebrow="02 — Boundaries"
				title="What we are not — and what does not yet exist"
				audiences={['All', 'Funders', 'Governance']}
				scriptKey="whatWeAreNot"
				graphic={<RealVsDemoBar />}
			>
				<p>Clarity about what does not yet exist is as important as describing what does. The following are <strong className="text-white">not current realities</strong>:</p>
				<ul>
					<li>A registered league or confirmed tournament</li>
					<li>Signed commercial partners or confirmed sponsorship</li>
					<li>A real community team onboarded to the platform</li>
					<li>A player agency or talent representation service</li>
					<li>Ownership or governance authority over any community club</li>
				</ul>
				<p><strong className="text-white">Unami Stars is a demonstration.</strong> It is a fictional pilot built to show how the model could work. Every player profile, fixture, and result is illustrative until verified with the community and authorised for publication.</p>
				<div className="not-prose mt-6 rounded-xl border border-orange-500/20 bg-orange-500/8 p-5">
					<p className="text-sm font-semibold text-orange-300 mb-2">Why we say this explicitly</p>
					<p className="text-xs text-white/60 leading-relaxed">Overstating what exists undermines trust with communities, funders, and governance bodies. We describe what is real, what is proposed, and what is still to be decided — and we keep those three things clearly separate.</p>
				</div>
			</Section>

			<Divider label="Stakeholder sections" />

			{/* ── 03 COMMUNITY FAs ─────────────────────────────────────────── */}
			<Section
				id="for-community"
				eyebrow="03 — Community FAs"
				title="For community football associations and grassroots teams"
				audiences={['Community FA']}
				scriptKey="forCommunityFAs"
				accent="radial-gradient(ellipse at right, rgba(16,185,129,0.06), transparent 70%)"
			>
				<p>If you are a community football association or a grassroots team, here is what the partnership means for you.</p>
				<p><strong className="text-white">You remain in charge.</strong> Your team name, your identity, your sporting decisions, your coaching, your selection, your local governance — all of that stays with you.</p>
				<p>What we provide is the infrastructure layer: a website, a content management system, training for your administrators, and support when things go wrong.</p>
				<div className="not-prose mt-6 grid gap-3 sm:grid-cols-3">
					{[
						['You control', ['Team identity and name', 'Sporting decisions and selection', 'Local governance and finances', 'Who approves your publications', 'Whether to continue the partnership'], 'border-emerald-500/20 bg-emerald-500/5'],
						['We provide', ['Website and CMS infrastructure', 'Administrator training', 'Technical maintenance and support', 'Stakeholder coordination (where agreed)', 'Content export if you leave'], 'border-white/8 bg-white/[0.03]'],
						['We never do', ['Publish without your approval', 'Store youth data without consent', 'Override your sporting authority', 'Tie your identity to our brand', 'Make decisions on your behalf'], 'border-red-500/20 bg-red-500/5'],
					].map(([heading, items, cls]) => (
						<div key={heading as string} className={`rounded-xl border p-4 ${cls}`}>
							<p className="text-xs font-semibold text-white mb-3">{heading as string}</p>
							<ul className="space-y-1.5">
								{(items as string[]).map(item => (
									<li key={item} className="text-xs text-white/55 flex gap-2">
										<span className="text-gold/60 shrink-0 mt-0.5">·</span>{item}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</Section>

			{/* ── 04 FUNDERS ───────────────────────────────────────────────── */}
			<Section
				id="for-funders"
				eyebrow="04 — Funders"
				title="For funders, grant bodies, and philanthropic supporters"
				audiences={['Funders']}
				scriptKey="forFunders"
				accent="radial-gradient(ellipse at right, rgba(59,130,246,0.06), transparent 70%)"
				graphic={<TheoryOfChange />}
			>
				<p>We are at the <strong className="text-white">pilot stage</strong>. One illustrative team — Unami Stars — has been built to demonstrate the model. We have not yet onboarded a real community team.</p>
				<p>The theory of change: donated digital infrastructure, combined with training and ongoing support, helps community teams spend less time on fragmented administration and more time on the sport and community activity they value. We believe this is worth testing. We are not claiming it has been proven.</p>
				<div className="not-prose mt-6 grid gap-3 sm:grid-cols-2">
					{[
						['What funding supports', 'Infrastructure, training, maintenance, and support for community teams. Not commercial activity, not talent representation, not a league that does not yet exist.'],
						['How we report', 'Honestly — distinguishing outputs from outcomes, with sample size, timeframe, and limitations stated. No inflated impact claims.'],
						['Commercial firewall', 'Restricted grants and sponsor funds are used only according to their conditions. We separate charitable activity, shared operations, events, and any earned income.'],
						['Sustainability model', 'We model three scenarios for every recurring offer: fully resourced, reduced capacity, and service exit. We do not promise indefinite free service.'],
					].map(([t, b]) => <Card key={t} title={t} body={b} />)}
				</div>
			</Section>

			{/* ── 05 GOVERNANCE ────────────────────────────────────────────── */}
			<Section
				id="for-governance"
				eyebrow="05 — Governance & Safeguarding"
				title="For governance, safeguarding, and compliance reviewers"
				audiences={['Governance']}
				scriptKey="forGovernance"
				accent="radial-gradient(ellipse at right, rgba(249,115,22,0.06), transparent 70%)"
				graphic={<SafeguardingShield />}
			>
				<p>Youth safeguarding is built into the operating model as a <strong className="text-white">gate, not an afterthought</strong>.</p>
				<div className="not-prose mt-4 grid gap-3 sm:grid-cols-2">
					{[
						['Player profiles', 'Default to private. Guardian consent required before any identifiable youth content is published.'],
						['Fixture details', 'Travel patterns and venue details are not published without review. Public venue name only — never private addresses.'],
						['CMS workflow fields', 'Guide editors through safeguarding checks. These are editorial guides — not technical access controls. Proper role-based access must be configured separately.'],
						['Data minimisation', 'We collect only what is needed for an agreed purpose. No date of birth fields on public profiles. No sensitive case information in the general CMS.'],
						['What still needs doing', 'Before any real team stores personal information: configure least-privilege Studio roles, test public GROQ queries for unintended disclosure, confirm data responsibilities with qualified advisers.'],
						['South African context', 'Applicable child-protection, privacy, and sport requirements must be confirmed with competent advisers and relevant authorities. This programme does not certify compliance.'],
					].map(([t, b]) => <Card key={t} title={t} body={b} />)}
				</div>
			</Section>

			{/* ── 06 COMMERCIAL ────────────────────────────────────────────── */}
			<Section
				id="for-commercial"
				eyebrow="06 — Commercial Partners"
				title="For potential commercial partners and sponsors"
				audiences={['Commercial']}
				scriptKey="forCommercial"
				accent="radial-gradient(ellipse at right, rgba(168,85,247,0.06), transparent 70%)"
				graphic={<FirewallDiagram />}
			>
				<p>Commercial partners receive <strong className="text-white">only what is written in an approved agreement</strong>. That agreement will specify recognition, deliverables, duration, and reporting.</p>
				<div className="not-prose mt-6 rounded-xl border border-white/8 bg-white/[0.03] p-6">
					<p className="text-sm font-semibold text-white mb-4">The commercial firewall</p>
					<div className="grid gap-4 sm:grid-cols-2">
						{[
							['What partners can receive', ['Named recognition in approved materials', 'Agreed deliverables in writing', 'Transparent reporting on agreed terms', 'Association with community sport impact'], 'text-emerald-300'],
							['What partners cannot receive', ['Access to young people or personal data', 'Team selection or coaching influence', 'Editorial control over the website', 'Implied endorsement beyond agreed terms', "Override of a team's right to decline"], 'text-red-300'],
						].map(([heading, items, colour]) => (
							<div key={heading as string}>
								<p className={`text-xs font-semibold mb-2 ${colour}`}>{heading as string}</p>
								<ul className="space-y-1.5">
									{(items as string[]).map(item => (
										<li key={item} className="text-xs text-white/55 flex gap-2">
											<span className="text-gold/60 shrink-0 mt-0.5">·</span>{item}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				<p className="mt-6">If you want to support community sport in South Africa in a way that is transparent, proportionate, and governed — we want to hear from you. If you want something else, this is not the right programme.</p>
			</Section>

			<Divider label="Programme direction" />

			{/* ── 07 LEADERSHIP ────────────────────────────────────────────── */}
			<Section
				id="for-leadership"
				eyebrow="07 — Programme Direction"
				title="Decisions that shape what this programme becomes"
				audiences={['Leadership', 'All']}
				scriptKey="forLeadership"
				accent="radial-gradient(ellipse at right, rgba(243,185,66,0.06), transparent 70%)"
			>
				<p>There are decisions that need to be made before Unami Sports can move from demonstration to live operation. These are <strong className="text-white">leadership decisions</strong> — about mandate, accountability, and what the programme is prepared to commit to.</p>
				<div className="not-prose mt-6 space-y-2">
					{[
						['Legal identity', 'What exact registered entity and public designation should be used for Unami Foundation? "NPC" should only be used after verifying the registered legal name and company number.'],
						['Programme mandate', 'What services are guaranteed, what are optional, and what depends on funding being confirmed?'],
						['Safeguarding accountability', 'Who is the competent safeguarding lead? What training and referral arrangements exist? Which data should never be stored in this CMS?'],
						['Data stewardship', 'Which party determines purposes and means for each class of information? What written arrangements are needed?'],
						['Account separation', 'Does each team need an isolated dataset, or a shared editorial space with carefully scoped roles? This affects privacy, cost, and operating capacity.'],
						['Funding and costs', 'Which recurring infrastructure and support costs are paid by the Foundation, a funder, the team, or another agreed source?'],
						['Competition pathway', 'What readiness, team approvals, external permissions, safety controls, budget, and event governance must be in place before convening a tournament?'],
						['Talent pathway', "Is the Foundation's mandate limited to development and referral, or does leadership intend to consider formal representation? This requires separate governance, legal review, and conflict controls."],
						['Commercial stewardship', "How will earned income, sponsorship, tournament resources, and any cross-subsidy be approved, accounted for, disclosed, and aligned with the Foundation's governing documents?"],
						['Pilot readiness', 'When is the programme ready to onboard a real community team — not just a demonstration? What are the minimum conditions?'],
					].map(([title, body], i) => (
						<details key={title as string} className="accordion group rounded-xl border border-white/8 bg-white/[0.03] hover:border-gold/15 transition-colors">
							<summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none">
								<div className="flex items-center gap-3">
									<span className="technical text-[10px] text-gold/50 w-5 shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
									<span className="text-sm font-medium text-white">{title as string}</span>
								</div>
								<svg className="size-4 text-white/30 shrink-0 transition-[rotate] group-open:rotate-180" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
									<path d="M4 6l4 4 4-4" />
								</svg>
							</summary>
							<div className="px-5 pb-5 pt-1">
								<p className="text-sm text-white/55 leading-relaxed pl-8">{body as string}</p>
							</div>
						</details>
					))}
				</div>
			</Section>

			{/* ── 08 ROADMAP ───────────────────────────────────────────────── */}
			<section id="roadmap" className="relative border-b border-white/8 py-20 scroll-mt-24 overflow-hidden" aria-labelledby="roadmap-heading">
				<HexPattern className="pointer-events-none absolute inset-0 opacity-50" />
				<div className="section py-0 relative z-10">
					<div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
						<div className="flex flex-col gap-4 lg:pt-1">
							<p className="technical text-xs text-gold/70">08 — Roadmap</p>
							<h2 id="roadmap-heading" className="h3 text-white text-balance leading-tight">The growth pathway — staged, gated, community-led</h2>
							<div className="flex flex-wrap gap-2">
								{['All', 'Funders', 'Leadership'].map(a => <AudiencePill key={a} label={a} />)}
							</div>
							<div className="mt-2"><Narrator script={SCRIPTS.roadmap} label="Listen" /></div>
							{/* phase overview graphic */}
							<div className="mt-6 hidden lg:flex flex-col gap-2">
								{[0,1,2,3,4,5,6,7].map(n => (
									<div key={n} className="flex items-center gap-3">
										<PhaseBadge phase={n} active={n === 0} />
										<div className={`h-px flex-1 ${n === 0 ? 'bg-gold/40' : 'bg-white/8'}`} />
									</div>
								))}
							</div>
						</div>
						<div className="space-y-0">
							{[
								['Phase 0', 'Foundation readiness', 'Verify legal identity, governance authority, insurance, and public-facing description. Confirm technical and service owners, budget, recurring costs, and capacity.', 'Now', true],
								['Phase 1', 'Co-design and pilot agreement', 'Identify a real team and its authorised representatives. Listen to players, guardians, coaches, and community voices. Agree boundaries, support offer, data responsibilities, success measures, duration, and exit.', 'Next', false],
								['Phase 2', 'Safety and infrastructure controls', 'Configure least-privilege Studio roles. Test public queries for unintended disclosure. Finalise consent, image, correction, complaint, incident, and retention procedures.', 'Before launch', false],
								['Phase 3', 'Configure and train', 'Replace demo identity with verified, authorised content. Train primary and backup team editors. Record support routes and Foundation escalation boundaries.', 'Before launch', false],
								['Phase 4', 'Limited launch and learning', 'Publish only approved pages and appropriate information. Monitor support burden, user feedback, page accuracy, and privacy requests.', 'Launch', false],
								['Phase 5', 'Cohort review and tournament feasibility', 'Review the pilot with every participating team. Prepare a tournament concept only if teams choose it — with written approval, safety arrangements, permissions, budget, and cancellation plan.', 'Post-pilot', false],
								['Phase 6', 'Run and learn from a limited tournament', 'Deliver only after required approvals, safety arrangements, venue checks, officials, first aid, and confirmed resources are in place.', 'Future', false],
								['Phase 7', 'Development league feasibility', 'Co-design rules and governance with interested teams. Proceed only if teams approve, external checks are complete, and the recurring service is resourced.', 'Future', false],
							].map(([phase, title, body, timing, active], i) => (
								<div key={phase as string} className="flex gap-4 group">
									<div className="flex flex-col items-center">
										<PhaseBadge phase={i} active={active as boolean} />
										{i < 7 && <div className="w-px flex-1 bg-white/8 my-1" />}
									</div>
									<div className="pb-8 pt-1 min-w-0">
										<div className="flex flex-wrap items-center gap-2 mb-1">
											<p className="text-sm font-semibold text-white">{title as string}</p>
											<span className={`technical text-[10px] border rounded px-1.5 py-0.5 ${active ? 'border-gold/30 text-gold bg-gold/10' : 'border-white/10 text-white/30'}`}>{timing as string}</span>
										</div>
										<p className="text-xs text-white/50 leading-relaxed">{body as string}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ── 09 LIVE DEMO ─────────────────────────────────────────────── */}
			<Section
				id="live-demo"
				eyebrow="09 — Live Demonstration"
				title="What is live today — and what it demonstrates"
				audiences={['All']}
				scriptKey="liveDemo"
				graphic={<PlatformStack />}
			>
				<p>The Unami Sports platform is live at <a href="https://unamisports.unamifoundation.org" className="text-gold underline underline-offset-2 hover:text-gold-light" target="_blank" rel="noopener noreferrer">unamisports.unamifoundation.org</a>. Everything you see is demonstration content.</p>
				<div className="not-prose mt-6 grid gap-3 sm:grid-cols-2">
					{[
						['Infrastructure', 'Real', 'Next.js App Router, Sanity CMS, Vercel deployment, custom domain, live content API.'],
						['Sports components', 'Real', 'Fixture cards, player cards, event cards, score badges, status indicators, position badges — all built and working.'],
						['Content management', 'Real', 'Full CMS with sports-specific schemas for teams, players, fixtures, events, competitions, stakeholders, governance, commercial, and talent pathways.'],
						['Safeguarding gates', 'Real', 'Guardian consent validation, public listing gates, safety check requirements — all enforced in the CMS workflow.'],
						['Unami Stars team', 'Demo', 'Fictional. Player profiles, fixtures, and results are illustrative. Not a registered club or real roster.'],
						['Partners and sponsors', 'Demo', 'No signed commercial partners. Stakeholder records are workflow examples, not confirmed relationships.'],
					].map(([label, status, body]) => (
						<div key={label as string} className={`rounded-xl border p-4 ${status === 'Real' ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-orange-500/15 bg-orange-500/5'}`}>
							<div className="flex items-center justify-between mb-2">
								<p className="text-xs font-semibold text-white">{label as string}</p>
								<span className={`technical text-[10px] rounded px-1.5 py-0.5 ${status === 'Real' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'}`}>{status as string}</span>
							</div>
							<p className="text-xs text-white/55 leading-relaxed">{body as string}</p>
						</div>
					))}
				</div>
				<div className="not-prose mt-6 flex flex-wrap gap-3">
					<a href="https://unamisports.unamifoundation.org" target="_blank" rel="noopener noreferrer" className="action-gold text-sm">View Unami Sports →</a>
					<a href="https://unamisports.unamifoundation.org/stars" target="_blank" rel="noopener noreferrer" className="action text-sm">View Unami Stars →</a>
				</div>
			</Section>

			<Divider label="Summary" />

			{/* ── 10 DECISIONS / NEXT STEPS ────────────────────────────────── */}
			<section id="decisions" className="relative border-b border-white/8 py-20 scroll-mt-24 overflow-hidden" aria-labelledby="decisions-heading">
				<div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
				<div className="section py-0 relative z-10">
					<div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
						<div className="flex flex-col gap-4 lg:pt-1">
							<p className="technical text-xs text-gold/70">10 — What happens next</p>
							<h2 id="decisions-heading" className="h3 text-white text-balance leading-tight">The programme is ready. The decisions belong to leadership.</h2>
							<div className="flex flex-wrap gap-2">
								{['Leadership', 'All'].map(a => <AudiencePill key={a} label={a} />)}
							</div>
							<div className="mt-2"><Narrator script={SCRIPTS.closing} label="Listen" /></div>
							{/* visual readiness ring */}
							<div className="mt-6 hidden lg:block">
								<svg viewBox="0 0 120 120" className="w-32 h-32" aria-hidden>
									<circle cx="60" cy="60" r="50" fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="8" />
									<circle cx="60" cy="60" r="50" fill="none" stroke="#f3b942" strokeOpacity="0.4" strokeWidth="8"
										strokeDasharray="105 209" strokeDashoffset="52" strokeLinecap="round" />
									<text x="60" y="56" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="monospace">50%</text>
									<text x="60" y="70" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="sans-serif">READY</text>
								</svg>
							</div>
						</div>
						<div className="space-y-6">
							<div className="prose text-white/80 text-[0.95rem] leading-relaxed">
								<p>The infrastructure is built. The operating model is documented. The safeguarding framework is designed. The demonstration is live.</p>
								<p>What moves this programme from demonstration to live operation is a set of leadership decisions — about legal identity, mandate, accountability, funding, and readiness.</p>
							</div>
							<div className="grid gap-3 sm:grid-cols-3">
								{[
									['Ready now', ['Digital infrastructure', 'Sports CMS schemas', 'Safeguarding workflow gates', 'Reusable component library', 'Live demonstration site', 'Operating model documentation'], 'border-emerald-500/20 bg-emerald-500/5', 'text-emerald-300'],
									['Needs leadership decision', ['Legal identity confirmed', 'Programme mandate defined', 'Safeguarding lead named', 'Data responsibilities agreed', 'Funding model confirmed', 'Pilot readiness criteria set'], 'border-gold/20 bg-gold/5', 'text-gold'],
									['Needs community agreement', ['Real team identified', 'Pilot boundaries agreed', 'Team administrators trained', 'Guardian consent process live', 'Support routes confirmed', 'Review dates set'], 'border-blue-500/20 bg-blue-500/5', 'text-blue-300'],
								].map(([heading, items, cls, hcls]) => (
									<div key={heading as string} className={`rounded-xl border p-4 ${cls}`}>
										<p className={`text-xs font-semibold mb-3 ${hcls}`}>{heading as string}</p>
										<ul className="space-y-1.5">
											{(items as string[]).map(item => (
												<li key={item} className="text-xs text-white/55 flex gap-2">
													<span className="text-gold/60 shrink-0 mt-0.5">·</span>{item}
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
							<div className="rounded-xl border border-gold/25 bg-gold/8 p-6">
								<div className="flex items-start gap-4">
									<div className="size-10 shrink-0 rounded-full bg-gold/20 flex items-center justify-center">
										<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
											<path d="M9 2a7 7 0 1 1 0 14A7 7 0 0 1 9 2zm0 3v4l3 2" stroke="#f3b942" strokeWidth="1.5" strokeLinecap="round" />
										</svg>
									</div>
									<div>
										<p className="text-sm font-semibold text-gold mb-1">Get in touch</p>
										<p className="text-sm text-white/65 leading-relaxed">
											Community FA, funder, governance reviewer, or potential partner — we want to hear from you.{' '}
											<a href="mailto:hello@unamifoundation.org" className="text-gold underline underline-offset-2">hello@unamifoundation.org</a>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── FOOTER ───────────────────────────────────────────────────── */}
			<footer className="border-t border-white/8 py-12">
				<div className="section py-0">
					<div className="flex flex-wrap items-center justify-between gap-6 mb-8">
						<div className="flex flex-wrap items-center gap-6">
							<Img image={logoImg(SPORTS_LOGO)} width={120} className="h-7 w-auto object-contain opacity-60" alt="Unami Sports" />
							<Img image={logoImg(STARS_LOGO)} width={100} className="h-6 w-auto object-contain opacity-40" alt="Unami Stars" />
						</div>
						<a href="/" className="text-xs text-white/30 hover:text-white transition-colors">← Back to Unami Sports</a>
					</div>
					<div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6 text-xs text-white/25">
						<p>Unami Sports · Unami Foundation · Programme Presentation</p>
						<p>Not indexed by search engines. Share the link directly with stakeholders.</p>
					</div>
				</div>
			</footer>

		</div>
	)
}
