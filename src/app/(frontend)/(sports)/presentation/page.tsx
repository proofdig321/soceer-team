import type { Metadata } from 'next'
import { SCRIPTS } from './scripts'
import Narrator from '@/ui/narrator'

export const metadata: Metadata = {
	title: 'Programme Presentation — Unami Sports',
	description: 'A comprehensive overview of the Unami Sports programme for all stakeholders — community FAs, funders, governance reviewers, commercial partners, and programme leadership.',
	robots: { index: false },
}

const AUDIENCE_COLOURS: Record<string, string> = {
	All:         'bg-white/10 text-white/60',
	'Community FA': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
	Funders:     'bg-blue-500/15 text-blue-300 border-blue-500/20',
	Governance:  'bg-orange-500/15 text-orange-300 border-orange-500/20',
	Commercial:  'bg-purple-500/15 text-purple-300 border-purple-500/20',
	Leadership:  'bg-gold/15 text-gold border-gold/20',
}

function AudiencePill({ label }: { label: string }) {
	return (
		<span className={`technical inline-flex items-center rounded border px-2 py-0.5 text-[10px] ${AUDIENCE_COLOURS[label] ?? AUDIENCE_COLOURS.All}`}>
			{label}
		</span>
	)
}

function Section({
	id,
	eyebrow,
	title,
	audiences,
	scriptKey,
	children,
}: {
	id: string
	eyebrow: string
	title: string
	audiences: string[]
	scriptKey: keyof typeof SCRIPTS
	children: React.ReactNode
}) {
	return (
		<section
			id={id}
			className="border-b border-white/8 py-20 scroll-mt-24"
			aria-labelledby={`${id}-heading`}
		>
			<div className="section py-0 grid gap-10 lg:grid-cols-[1fr_2fr]">
				{/* left column — meta */}
				<div className="flex flex-col gap-4 lg:pt-1">
					<p className="technical text-xs text-gold/70">{eyebrow}</p>
					<h2 id={`${id}-heading`} className="h3 text-white text-balance leading-tight">
						{title}
					</h2>
					<div className="flex flex-wrap gap-2">
						{audiences.map(a => <AudiencePill key={a} label={a} />)}
					</div>
					<div className="mt-2">
						<Narrator script={SCRIPTS[scriptKey]} label="Listen to this section" />
					</div>
				</div>

				{/* right column — content */}
				<div className="prose text-white/80 text-[0.95rem] leading-relaxed">
					{children}
				</div>
			</div>
		</section>
	)
}

function Divider({ label }: { label: string }) {
	return (
		<div className="section py-0 flex items-center gap-4 py-8">
			<div className="h-px flex-1 bg-white/8" />
			<span className="technical text-[10px] text-white/30">{label}</span>
			<div className="h-px flex-1 bg-white/8" />
		</div>
	)
}

export default function PresentationPage() {
	return (
		<div className="bg-forest min-h-screen text-white">

			{/* ── Hero ─────────────────────────────────────────────────────── */}
			<header className="section border-b border-white/8 pb-16 pt-24">
				<div className="max-w-3xl">
					<p className="technical mb-4 text-xs text-gold/70">Programme Presentation · Unami Sports</p>
					<h1 className="h0 mb-6 text-balance text-white">
						Building community sport infrastructure that lasts.
					</h1>
					<p className="text-lg text-white/65 leading-relaxed max-w-2xl">
						This presentation is for every stakeholder in the Unami Sports programme — community football associations, funders, governance reviewers, commercial partners, and the people leading this work. Each section has a voice narrator. Every claim is honest about what exists today, what is proposed, and what decisions still need to be made.
					</p>
					<div className="mt-8 flex flex-wrap items-center gap-4">
						<Narrator script={SCRIPTS.opening} label="Listen to introduction" />
						<a href="#what-we-are" className="text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4">
							Skip to content ↓
						</a>
					</div>
				</div>

				{/* audience key */}
				<div className="mt-12 flex flex-wrap gap-3 items-center">
					<span className="text-xs text-white/30 mr-2">Sections are tagged for:</span>
					{Object.keys(AUDIENCE_COLOURS).map(a => <AudiencePill key={a} label={a} />)}
				</div>
			</header>

			{/* ── Nav ──────────────────────────────────────────────────────── */}
			<nav aria-label="Presentation sections" className="sticky top-[var(--header-height,0px)] z-10 border-b border-white/8 bg-forest/95 backdrop-blur-md">
				<div className="section py-0 overflow-x-auto no-scrollbar">
					<ul className="flex gap-6 py-3 text-xs text-white/50 whitespace-nowrap">
						{[
							['#what-we-are',    'What we are'],
							['#what-we-are-not','What we are not'],
							['#for-community',  'Community FAs'],
							['#for-funders',    'Funders'],
							['#for-governance', 'Governance'],
							['#for-commercial', 'Commercial'],
							['#for-leadership', 'Leadership'],
							['#roadmap',        'Roadmap'],
							['#live-demo',      'Live demo'],
							['#decisions',      'Decisions required'],
						].map(([href, label]) => (
							<li key={href}>
								<a href={href} className="hover:text-white transition-colors">{label}</a>
							</li>
						))}
					</ul>
				</div>
			</nav>

			{/* ── Sections ─────────────────────────────────────────────────── */}

			<Section
				id="what-we-are"
				eyebrow="01 — Identity"
				title="What Unami Sports is"
				audiences={['All']}
				scriptKey="whatWeAre"
			>
				<p>
					Unami Sports is a <strong className="text-white">community sport enablement programme</strong> run by Unami Foundation. We are not a football club, a governing body, a league, or a commercial sports business.
				</p>
				<p>
					We are a <strong className="text-white">non-profit-led operating partner</strong>. That means we donate and maintain practical digital infrastructure, train community team administrators, coordinate stakeholder relationships where agreed, and support teams to manage their own sporting affairs.
				</p>
				<p>
					The technology is a tool. The programme is the people, the relationships, the governance, and the ongoing service. A website alone cannot keep young people safe, secure funding, or make a community organisation sustainable. Those outcomes depend on community leadership, accountable governance, and relationships that have clear boundaries.
				</p>
				<div className="mt-6 grid gap-3 sm:grid-cols-2">
					{[
						['Non-profit steward', 'Unami Foundation governs the programme, its resources, and its partner relationships.'],
						['Operating partner', 'We provide infrastructure and support. Teams retain their sporting authority.'],
						['Technology for good', 'Digital tools that reduce administrative burden — not a product to be sold.'],
						['Community-first', 'Every decision starts with what the community team needs and controls.'],
					].map(([title, body]) => (
						<div key={title} className="rounded-lg border border-white/8 bg-white/4 p-4">
							<p className="text-sm font-semibold text-white mb-1">{title}</p>
							<p className="text-xs text-white/55 leading-relaxed">{body}</p>
						</div>
					))}
				</div>
			</Section>

			<Section
				id="what-we-are-not"
				eyebrow="02 — Boundaries"
				title="What we are not — and what does not yet exist"
				audiences={['All', 'Funders', 'Governance']}
				scriptKey="whatWeAreNot"
			>
				<p>
					Clarity about what does not yet exist is as important as describing what does. The following are <strong className="text-white">not current realities</strong>:
				</p>
				<ul>
					<li>A registered league or confirmed tournament</li>
					<li>Signed commercial partners or confirmed sponsorship</li>
					<li>A real community team onboarded to the platform</li>
					<li>A player agency or talent representation service</li>
					<li>Ownership or governance authority over any community club</li>
				</ul>
				<p>
					<strong className="text-white">Unami Stars is a demonstration.</strong> It is a fictional pilot built to show how the model could work. Every player profile, fixture, and result on the Unami Stars site is illustrative until verified with the community and authorised for publication.
				</p>
				<div className="mt-6 rounded-lg border border-orange-500/20 bg-orange-500/8 p-5">
					<p className="text-sm font-semibold text-orange-300 mb-2">Why we say this explicitly</p>
					<p className="text-xs text-white/60 leading-relaxed">
						Overstating what exists undermines trust with communities, funders, and governance bodies. We describe what is real, what is proposed, and what is still to be decided — and we keep those three things clearly separate.
					</p>
				</div>
			</Section>

			<Divider label="Stakeholder sections" />

			<Section
				id="for-community"
				eyebrow="03 — Community FAs"
				title="For community football associations and grassroots teams"
				audiences={['Community FA']}
				scriptKey="forCommunityFAs"
			>
				<p>
					If you are a community football association or a grassroots team, here is what the partnership means for you.
				</p>
				<p>
					<strong className="text-white">You remain in charge.</strong> Your team name, your identity, your sporting decisions, your coaching, your selection, your local governance — all of that stays with you.
				</p>
				<p>
					What we provide is the infrastructure layer: a website, a content management system, training for your administrators, and support when things go wrong.
				</p>
				<div className="mt-6 grid gap-3 sm:grid-cols-3">
					{[
						['You control', ['Team identity and name', 'Sporting decisions and selection', 'Local governance and finances', 'Who approves your publications', 'Whether to continue the partnership']],
						['We provide', ['Website and CMS infrastructure', 'Administrator training', 'Technical maintenance and support', 'Stakeholder coordination (where agreed)', 'Content export if you leave']],
						['We never do', ['Publish without your approval', 'Store youth data without consent', 'Override your sporting authority', 'Tie your identity to our brand', 'Make decisions on your behalf']],
					].map(([heading, items]) => (
						<div key={heading as string} className="rounded-lg border border-white/8 bg-white/4 p-4">
							<p className="text-xs font-semibold text-white mb-3">{heading as string}</p>
							<ul className="space-y-1.5">
								{(items as string[]).map(item => (
									<li key={item} className="text-xs text-white/55 flex gap-2">
										<span className="text-gold/60 shrink-0">·</span>
										{item}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</Section>

			<Section
				id="for-funders"
				eyebrow="04 — Funders"
				title="For funders, grant bodies, and philanthropic supporters"
				audiences={['Funders']}
				scriptKey="forFunders"
			>
				<p>
					We are at the <strong className="text-white">pilot stage</strong>. One illustrative team — Unami Stars — has been built to demonstrate the model. We have not yet onboarded a real community team.
				</p>
				<p>
					The theory of change is: donated digital infrastructure, combined with training and ongoing support, helps community teams spend less time on fragmented administration and more time on the sport and community activity they value. We believe this is worth testing. We are not claiming it has been proven.
				</p>
				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					{[
						['What funding supports', 'Infrastructure, training, maintenance, and support for community teams. Not commercial activity, not talent representation, not a league that does not yet exist.'],
						['How we report', 'Honestly — distinguishing outputs from outcomes, with sample size, timeframe, and limitations stated. No inflated impact claims.'],
						['Commercial firewall', 'Restricted grants and sponsor funds are used only according to their conditions. We separate charitable activity, shared operations, events, and any earned income.'],
						['Sustainability model', 'We model three scenarios for every recurring offer: fully resourced, reduced capacity, and service exit. We do not promise indefinite free service.'],
					].map(([title, body]) => (
						<div key={title} className="rounded-lg border border-white/8 bg-white/4 p-4">
							<p className="text-sm font-semibold text-white mb-2">{title}</p>
							<p className="text-xs text-white/55 leading-relaxed">{body}</p>
						</div>
					))}
				</div>
			</Section>

			<Section
				id="for-governance"
				eyebrow="05 — Governance & Safeguarding"
				title="For governance, safeguarding, and compliance reviewers"
				audiences={['Governance']}
				scriptKey="forGovernance"
			>
				<p>
					Youth safeguarding is built into the operating model as a <strong className="text-white">gate, not an afterthought</strong>.
				</p>
				<div className="mt-4 grid gap-3 sm:grid-cols-2">
					{[
						['Player profiles', 'Default to private. Guardian consent required before any identifiable youth content is published.'],
						['Fixture details', 'Travel patterns and venue details are not published without review. Public venue name only — never private addresses.'],
						['CMS workflow fields', 'Guide editors through safeguarding checks. These are editorial guides — not technical access controls. Proper role-based access must be configured separately.'],
						['Data minimisation', 'We collect only what is needed for an agreed purpose. No date of birth fields on public profiles. No sensitive case information in the general CMS.'],
						['What still needs doing', 'Before any real team stores personal information: configure least-privilege Studio roles, test public GROQ queries for unintended disclosure, confirm data responsibilities with qualified advisers.'],
						['South African context', 'Applicable child-protection, privacy, and sport requirements must be confirmed with competent advisers and relevant authorities. This programme does not certify compliance.'],
					].map(([title, body]) => (
						<div key={title} className="rounded-lg border border-white/8 bg-white/4 p-4">
							<p className="text-xs font-semibold text-white mb-1.5">{title}</p>
							<p className="text-xs text-white/55 leading-relaxed">{body}</p>
						</div>
					))}
				</div>
			</Section>

			<Section
				id="for-commercial"
				eyebrow="06 — Commercial Partners"
				title="For potential commercial partners and sponsors"
				audiences={['Commercial']}
				scriptKey="forCommercial"
			>
				<p>
					Commercial partners receive <strong className="text-white">only what is written in an approved agreement</strong>. That agreement will specify recognition, deliverables, duration, and reporting.
				</p>
				<div className="mt-6 rounded-lg border border-white/8 bg-white/4 p-6">
					<p className="text-sm font-semibold text-white mb-4">The commercial firewall</p>
					<div className="grid gap-3 sm:grid-cols-2">
						{[
							['What partners can receive', ['Named recognition in approved materials', 'Agreed deliverables in writing', 'Transparent reporting on agreed terms', 'Association with community sport impact']],
							['What partners cannot receive', ['Access to young people or personal data', 'Team selection or coaching influence', 'Editorial control over the website', 'Implied endorsement beyond agreed terms', 'Override of a team\'s right to decline']],
						].map(([heading, items]) => (
							<div key={heading as string}>
								<p className="text-xs font-semibold text-white/70 mb-2">{heading as string}</p>
								<ul className="space-y-1.5">
									{(items as string[]).map(item => (
										<li key={item} className="text-xs text-white/55 flex gap-2">
											<span className="text-gold/60 shrink-0">·</span>
											{item}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				<p className="mt-6">
					If you want to support community sport in South Africa in a way that is transparent, proportionate, and governed — we want to hear from you. If you want something else, this is not the right programme.
				</p>
			</Section>

			<Divider label="Programme direction" />

			<Section
				id="for-leadership"
				eyebrow="07 — Programme Direction"
				title="Decisions that shape what this programme becomes"
				audiences={['Leadership', 'All']}
				scriptKey="forLeadership"
			>
				<p>
					There are decisions that need to be made before Unami Sports can move from demonstration to live operation. These are not technical questions. They are <strong className="text-white">leadership decisions</strong> — about mandate, accountability, and what the programme is prepared to commit to.
				</p>
				<div className="mt-6 space-y-3">
					{[
						['Legal identity', 'What exact registered entity and public designation should be used for Unami Foundation? "NPC" should only be used after verifying the registered legal name and company number.'],
						['Programme mandate', 'What services are guaranteed, what are optional, and what depends on funding being confirmed?'],
						['Safeguarding accountability', 'Who is the competent safeguarding lead? What training and referral arrangements exist? Which data should never be stored in this CMS?'],
						['Data stewardship', 'Which party determines purposes and means for each class of information? What written arrangements are needed?'],
						['Account separation', 'Does each team need an isolated dataset, or a shared editorial space with carefully scoped roles? This affects privacy, cost, and operating capacity.'],
						['Funding and costs', 'Which recurring infrastructure and support costs are paid by the Foundation, a funder, the team, or another agreed source?'],
						['Competition pathway', 'What readiness, team approvals, external permissions, safety controls, budget, and event governance must be in place before convening a tournament?'],
						['Talent pathway', 'Is the Foundation\'s mandate limited to development and referral, or does leadership intend to consider formal representation? This requires separate governance, legal review, and conflict controls.'],
						['Commercial stewardship', 'How will earned income, sponsorship, tournament resources, and any cross-subsidy be approved, accounted for, disclosed, and aligned with the Foundation\'s governing documents?'],
						['Pilot readiness', 'When is the programme ready to onboard a real community team — not just a demonstration? What are the minimum conditions?'],
					].map(([title, body], i) => (
						<details key={title as string} className="accordion rounded-lg border border-white/8 bg-white/4">
							<summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer">
								<div className="flex items-center gap-3">
									<span className="technical text-[10px] text-white/30 w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
									<span className="text-sm font-medium text-white">{title as string}</span>
								</div>
								<svg className="size-4 text-white/30 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
									<path d="M4 6l4 4 4-4" />
								</svg>
							</summary>
							<div className="px-5 pb-5 pt-1">
								<p className="text-sm text-white/60 leading-relaxed pl-8">{body as string}</p>
							</div>
						</details>
					))}
				</div>
			</Section>

			<Section
				id="roadmap"
				eyebrow="08 — Roadmap"
				title="The growth pathway — staged, gated, community-led"
				audiences={['All', 'Funders', 'Leadership']}
				scriptKey="roadmap"
			>
				<p>
					The growth pathway is <strong className="text-white">deliberately staged</strong>. No stage is automatic. Every stage has a gate that must be passed before moving forward.
				</p>
				<div className="mt-6 space-y-0">
					{[
						['Phase 0', 'Foundation readiness', 'Verify legal identity, governance authority, insurance, and public-facing description. Confirm technical and service owners, budget, recurring costs, and capacity.', 'Now'],
						['Phase 1', 'Co-design and pilot agreement', 'Identify a real team and its authorised representatives. Listen to players, guardians, coaches, and community voices. Agree boundaries, support offer, data responsibilities, success measures, duration, and exit.', 'Next'],
						['Phase 2', 'Safety and infrastructure controls', 'Configure least-privilege Studio roles. Test public queries for unintended disclosure. Finalise consent, image, correction, complaint, incident, and retention procedures.', 'Before launch'],
						['Phase 3', 'Configure and train', 'Replace demo identity with verified, authorised content. Train primary and backup team editors. Record support routes and Foundation escalation boundaries.', 'Before launch'],
						['Phase 4', 'Limited launch and learning', 'Publish only approved pages and appropriate information. Monitor support burden, user feedback, page accuracy, and privacy requests.', 'Launch'],
						['Phase 5', 'Cohort review and tournament feasibility', 'Review the pilot with every participating team. Prepare a tournament concept only if teams choose it — with written approval, safety arrangements, permissions, budget, and cancellation plan.', 'Post-pilot'],
						['Phase 6', 'Run and learn from a limited tournament', 'Deliver only after required approvals, safety arrangements, venue checks, officials, first aid, and confirmed resources are in place.', 'Future'],
						['Phase 7', 'Development league feasibility', 'Co-design rules and governance with interested teams. Proceed only if teams approve, external checks are complete, and the recurring service is resourced.', 'Future'],
					].map(([phase, title, body, timing], i) => (
						<div key={phase as string} className="flex gap-4 group">
							<div className="flex flex-col items-center">
								<div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-bold text-white/50 group-first:border-gold/40 group-first:text-gold">
									{i}
								</div>
								{i < 7 && <div className="w-px flex-1 bg-white/8 my-1" />}
							</div>
							<div className="pb-8 pt-1 min-w-0">
								<div className="flex items-center gap-3 mb-1">
									<p className="text-sm font-semibold text-white">{title as string}</p>
									<span className="technical text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">{timing as string}</span>
								</div>
								<p className="text-xs text-white/55 leading-relaxed">{body as string}</p>
							</div>
						</div>
					))}
				</div>
			</Section>

			<Section
				id="live-demo"
				eyebrow="09 — Live Demonstration"
				title="What is live today — and what it demonstrates"
				audiences={['All']}
				scriptKey="liveDemo"
			>
				<p>
					The Unami Sports platform is live at <a href="https://unamisports.unamifoundation.org" className="text-gold underline underline-offset-2 hover:text-gold-light" target="_blank" rel="noopener noreferrer">unamisports.unamifoundation.org</a>. Everything you see is demonstration content.
				</p>
				<div className="mt-6 grid gap-3 sm:grid-cols-2">
					{[
						['Infrastructure', 'Real', 'Next.js App Router, Sanity CMS, Vercel deployment, custom domain, live content API.'],
						['Sports components', 'Real', 'Fixture cards, player cards, event cards, score badges, status indicators, position badges — all built and working.'],
						['Content management', 'Real', 'Full CMS with sports-specific schemas for teams, players, fixtures, events, competitions, stakeholders, governance, commercial, and talent pathways.'],
						['Safeguarding gates', 'Real', 'Guardian consent validation, public listing gates, safety check requirements — all enforced in the CMS workflow.'],
						['Unami Stars team', 'Demonstration', 'Fictional. Player profiles, fixtures, and results are illustrative. Not a registered club or real roster.'],
						['Partners and sponsors', 'Demonstration', 'No signed commercial partners. Stakeholder records are workflow examples, not confirmed relationships.'],
					].map(([label, status, body]) => (
						<div key={label as string} className="rounded-lg border border-white/8 bg-white/4 p-4">
							<div className="flex items-center justify-between mb-2">
								<p className="text-xs font-semibold text-white">{label as string}</p>
								<span className={`technical text-[10px] rounded px-1.5 py-0.5 ${status === 'Real' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-orange-500/15 text-orange-300'}`}>
									{status as string}
								</span>
							</div>
							<p className="text-xs text-white/55 leading-relaxed">{body as string}</p>
						</div>
					))}
				</div>
				<div className="mt-6 flex flex-wrap gap-3">
					<a href="https://unamisports.unamifoundation.org" target="_blank" rel="noopener noreferrer" className="action-gold text-sm">
						View Unami Sports →
					</a>
					<a href="https://unamisports.unamifoundation.org/stars" target="_blank" rel="noopener noreferrer" className="action text-sm">
						View Unami Stars →
					</a>
				</div>
			</Section>

			<Divider label="Summary" />

			<Section
				id="decisions"
				eyebrow="10 — What happens next"
				title="The programme is ready. The decisions belong to leadership."
				audiences={['Leadership', 'All']}
				scriptKey="closing"
			>
				<p>
					The infrastructure is built. The operating model is documented. The safeguarding framework is designed. The demonstration is live.
				</p>
				<p>
					What moves this programme from demonstration to live operation is a set of leadership decisions — about legal identity, mandate, accountability, funding, and readiness. Those decisions are documented in section seven of this presentation.
				</p>
				<div className="mt-6 grid gap-3 sm:grid-cols-3">
					{[
						['Ready now', ['Digital infrastructure', 'Sports CMS schemas', 'Safeguarding workflow gates', 'Reusable component library', 'Live demonstration site', 'Operating model documentation']],
						['Needs leadership decision', ['Legal identity confirmed', 'Programme mandate defined', 'Safeguarding lead named', 'Data responsibilities agreed', 'Funding model confirmed', 'Pilot readiness criteria set']],
						['Needs community agreement', ['Real team identified', 'Pilot boundaries agreed', 'Team administrators trained', 'Guardian consent process live', 'Support routes confirmed', 'Review dates set']],
					].map(([heading, items]) => (
						<div key={heading as string} className="rounded-lg border border-white/8 bg-white/4 p-4">
							<p className="text-xs font-semibold text-white mb-3">{heading as string}</p>
							<ul className="space-y-1.5">
								{(items as string[]).map(item => (
									<li key={item} className="text-xs text-white/55 flex gap-2">
										<span className="text-gold/60 shrink-0">·</span>
										{item}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="mt-8 rounded-lg border border-gold/20 bg-gold/8 p-6">
					<p className="text-sm font-semibold text-gold mb-2">Get in touch</p>
					<p className="text-sm text-white/65 leading-relaxed">
						If you are a community football association, a funder, a governance reviewer, or a potential partner — we want to hear from you. Contact us at{' '}
						<a href="mailto:hello@unamifoundation.org" className="text-gold underline underline-offset-2">hello@unamifoundation.org</a>
					</p>
				</div>
			</Section>

			{/* ── Footer ───────────────────────────────────────────────────── */}
			<footer className="border-t border-white/8 py-12">
				<div className="section py-0 flex flex-wrap items-center justify-between gap-6 text-xs text-white/30">
					<p>Unami Sports · Unami Foundation · Programme Presentation</p>
					<p>This page is not indexed by search engines. Share the link directly with stakeholders.</p>
					<a href="/" className="hover:text-white transition-colors">← Back to Unami Sports</a>
				</div>
			</footer>
		</div>
	)
}
