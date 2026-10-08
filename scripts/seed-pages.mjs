/**
 * seed-pages.mjs — full page rebuild
 *
 * Rewrites all 10 unami.page.* documents with rich, varied module stacks
 * that exercise every available module type. Also cleans duplicate sports
 * docs and fixes the /fixtures slug collision.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-pages.mjs
 *   node --env-file=.env.local scripts/seed-pages.mjs --reset
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET
const token     = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
	console.error('Missing env vars')
	process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2026-10-05', useCdn: false, token })

// ── Portable Text helpers ──────────────────────────────────────────────────

function block(key, text, style = 'normal') {
	return { _key: key, _type: 'block', style, markDefs: [],
		children: [{ _key: key + 'c', _type: 'span', marks: [], text }] }
}

function blockLink(key, text, href, style = 'normal') {
	return { _key: key, _type: 'block', style,
		markDefs: [{ _key: key + 'md', _type: 'link', href }],
		children: [{ _key: key + 'c', _type: 'span', marks: [key + 'md'], text }] }
}

function ref(id) { return { _type: 'reference', _ref: id } }

function cta(key, label, href, theme = 'default') {
	return { _key: key, _type: 'cta', theme,
		link: { _type: 'link', type: 'external', external: href, label } }
}

function ctaInternal(key, label, pageId, theme = 'default') {
	return { _key: key, _type: 'cta', theme,
		link: { _type: 'link', type: 'internal', internal: ref(pageId), label } }
}

function card(key, eyebrow, heading, body) {
	return { _key: key, _type: 'card', eyebrow,
		content: [block(key + 'h', heading, 'h3'), block(key + 'b', body)] }
}

function step(key, heading, body) {
	return { _key: key, _type: 'step',
		content: [block(key + 'h', heading, 'h3'), block(key + 'b', body)] }
}

function stat(key, value, label, description) {
	return { _key: key, _type: 'stat', value, label, description }
}

function accordionItem(key, heading, body) {
	return { _key: key, _type: 'accordionItem', heading,
		content: [block(key + 'b', body)] }
}

function featureItem(key, label, description) {
	return { _key: key, _type: 'featureItem', label, description }
}

// ── Module builders ────────────────────────────────────────────────────────

function heroCover(key, eyebrow, heading, body, ctas = [], opts = {}) {
	return {
		_key: key, _type: 'hero.cover',
		eyebrow,
		content: [block(key + 'h', heading, 'h1'), block(key + 'b', body)],
		ctas,
		textAlign: opts.textAlign ?? 'left',
		verticalAlign: opts.verticalAlign ?? 'center',
	}
}

function heroSplit(key, eyebrow, heading, body, ctas = []) {
	return {
		_key: key, _type: 'hero.split',
		eyebrow,
		content: [block(key + 'h', heading, 'h1'), block(key + 'b', body)],
		ctas,
	}
}

function banner(key, text, theme = 'highlight', ctas = []) {
	return { _key: key, _type: 'banner', text, theme, ctas }
}

function featureBar(key, items) {
	return {
		_key: key, _type: 'feature.bar',
		items: items.map((item, i) => ({
			_key: key + 'i' + i, _type: 'object',
			label: item.label, description: item.description,
		})),
	}
}

function statList(key, eyebrow, introText, stats) {
	return {
		_key: key, _type: 'stat-list',
		eyebrow,
		intro: [block(key + 'i', introText, 'h2')],
		stats: stats.map((s, i) => ({
			_key: key + 's' + i, _type: 'stat',
			value: s.value, suffix: s.suffix,
			content: [block(key + 's' + i + 'c', s.label)],
		})),
		layout: 'grid',
	}
}

function cardList(key, eyebrow, introText, cards, columns = 3) {
	return {
		_key: key, _type: 'card-list',
		eyebrow,
		intro: [block(key + 'i', introText, 'h2')],
		cards: cards.map((c, i) => ({
			_key: key + 'c' + i, _type: 'card',
			eyebrow: c.eyebrow,
			content: [block(key + 'c' + i + 'h', c.heading, 'h3'), block(key + 'c' + i + 'b', c.body)],
		})),
		columns,
		layout: 'grid',
	}
}

function stepList(key, eyebrow, introText, steps) {
	return {
		_key: key, _type: 'step-list',
		eyebrow,
		intro: [block(key + 'i', introText, 'h2')],
		steps: steps.map((s, i) => ({
			_key: key + 'st' + i, _type: 'step',
			content: [block(key + 'st' + i + 'h', s.heading, 'h3'), block(key + 'st' + i + 'b', s.body)],
		})),
		enableSchema: false,
	}
}

function accordionList(key, eyebrow, introText, items) {
	return {
		_key: key, _type: 'accordion-list',
		eyebrow,
		intro: [block(key + 'i', introText, 'h2')],
		accordions: items.map((a, i) => ({
			_key: key + 'a' + i, _type: 'accordion',
			summary: a.summary,
			content: [block(key + 'a' + i + 'c', a.body)],
			open: i === 0,
		})),
		exclusive: true,
		enableSchema: true,
		layout: 'vertical',
	}
}

function tabbedContent(key, eyebrow, introText, tabs) {
	return {
		_key: key, _type: 'tabbed-content',
		eyebrow,
		intro: [block(key + 'i', introText, 'h2')],
		tabs: tabs.map((t, i) => ({
			_key: key + 't' + i, _type: 'tab',
			label: t.label,
			content: t.blocks,
			ctas: t.ctas ?? [],
		})),
	}
}

function mediaSplit(key, eyebrow, heading, body, ctas = [], mediaOnRight = false) {
	return {
		_key: key, _type: 'media.split',
		eyebrow,
		content: [block(key + 'h', heading, 'h2'), block(key + 'b', body)],
		ctas,
		mediaOnRight,
		mediaAspectRatio: '4/3',
	}
}

function testimonialFeature(key, quote, name, role) {
	return { _key: key, _type: 'testimonial.feature', quote, name, role }
}

function countdown(key, eyebrow, label, targetDate, ctas = []) {
	return { _key: key, _type: 'countdown', eyebrow, label, targetDate, ctas }
}

function callout(key, eyebrow, heading, body, ctas = []) {
	return {
		_key: key, _type: 'callout',
		eyebrow,
		intro: [block(key + 'h', heading, 'h2'), block(key + 'b', body)],
		ctas,
	}
}

function prose(key, blocks) {
	return { _key: key, _type: 'prose', content: blocks }
}

// ── Page documents ─────────────────────────────────────────────────────────

function buildPages() {
	const pages = []

	// ── HOME (index) ──────────────────────────────────────────────────────
	pages.push({
		_id: 'unami.page.home',
		_type: 'page',
		title: 'Unami Sports',
		metadata: {
			_type: 'metadata',
			title: 'Unami Sports — community sport, community-led',
			description: 'Unami Sports is a technology-for-good programme supporting grassroots teams with digital infrastructure, training and operating partnerships.',
			slug: { _type: 'slug', current: 'index' },
			noIndex: false,
		},
		modules: [
			heroCover('home-hero', 'UNAMI SPORTS · TECHNOLOGY FOR GOOD',
				'Community sport, community-led.',
				'Unami Sports is Unami Foundation\'s technology-for-good programme. We donate digital infrastructure, training and operating support so grassroots teams can manage their own affairs — and keep the decisions where they belong.',
				[
					cta('home-cta1', 'See the Unami Stars demo', '/unami-stars', 'default'),
					cta('home-cta2', 'How the model works', '/our-model', 'ghost'),
				],
				{ textAlign: 'left' }
			),
			featureBar('home-fbar', [
				{ label: 'Team-led', description: 'Clubs keep their own decisions' },
				{ label: 'Foundation-supported', description: 'Donated tools and training' },
				{ label: 'Technology for good', description: 'Built for community benefit' },
				{ label: 'Sport-agnostic', description: 'Football first, adaptable by sport' },
			]),
			statList('home-stats', 'THE PROGRAMME IN NUMBERS',
				'A small, supported cohort — learning before scaling.',
				[
					{ value: '1', suffix: '', label: 'Pilot team in 2026' },
					{ value: '14', suffix: '+', label: 'Sports schema types' },
					{ value: '20', suffix: '+', label: 'Page modules available' },
					{ value: '0', suffix: '', label: 'Decisions taken from teams' },
				]
			),
			cardList('home-cards', 'A TEAM-FIRST MODEL',
				'The platform serves the community.',
				[
					{ eyebrow: 'TEAM CONTROL', heading: 'The team leads locally', body: 'Unami Stars owns its sporting decisions, team identity, day-to-day coordination and approved public story. Local people — not software — make the decisions.' },
					{ eyebrow: 'FOUNDATION-ENABLED', heading: 'Unami Sports sustains the tools', body: 'Unami Foundation donates the platform and provides onboarding, training, support, maintenance and stakeholder coordination within an agreed service scope.' },
					{ eyebrow: 'RESILIENCE', heading: 'Built to last beyond one volunteer', body: 'Clear roles, practical handovers and shared know-how help a community team keep moving when people, devices or funding change.' },
				]
			),
			stepList('home-steps', 'FROM FIRST LOGIN TO LOCAL OWNERSHIP',
				'A practical partnership, step by step.',
				[
					{ heading: 'Listen and set boundaries', body: 'Agree the team\'s needs, decision rights, safeguarding expectations and what the Foundation will maintain.' },
					{ heading: 'Set up and train together', body: 'Configure a simple team workspace, train nominated administrators and practise everyday tasks.' },
					{ heading: 'Run the team\'s own workflow', body: 'The club updates approved information, coordinates locally and keeps its sporting decisions in community hands.' },
					{ heading: 'Review, support and adapt', body: 'The Foundation maintains the donated platform, answers support requests and coordinates agreed stakeholder or template changes.' },
				]
			),
			testimonialFeature('home-testimonial',
				'The point is not to take over club administration. It is to make useful technology understandable and supportable by the people who use it.',
				'Unami Sports operating model',
				'Community sports operating partnership'
			),
			callout('home-callout', 'GET INVOLVED',
				'Help community sport stay community-led.',
				'Explore a support partnership, share local expertise or help shape a practical template for grassroots teams.',
				[cta('home-callout-cta', 'Explore ways to support', '/get-involved', 'default')]
			),
		],
	})

	// ── UNAMI STARS TEAM PAGE ─────────────────────────────────────────────
	pages.push({
		_id: 'unami.page.team',
		_type: 'page',
		title: 'Unami Stars',
		metadata: {
			_type: 'metadata',
			title: 'Unami Stars — Emndozo, KwaGucingo',
			description: 'Unami Stars is a fictional youth football demo team based in Emndozo, KwaGucingo, KwaZulu-Natal — the illustrative first pilot for Unami Sports.',
			slug: { _type: 'slug', current: 'unami-stars' },
			noIndex: false,
		},
		modules: [
			heroCover('team-hero', 'UNAMI STARS · EMNDOZO, KWAGUCINGO',
				'A community team with a digital home.',
				'Unami Stars is a fictional youth football club in Emndozo, KwaGucingo, KwaZulu-Natal. This page demonstrates how a real participating team would present its public identity through the Unami Sports platform.',
				[
					cta('team-cta1', 'View fixtures', '/fixtures', 'default'),
					cta('team-cta2', 'See the model', '/our-model', 'ghost'),
				],
				{ textAlign: 'left' }
			),
			banner('team-banner',
				'Demo content — Unami Stars is a fictional illustrative team. No real roster, results or affiliations are represented.',
				'highlight'
			),
			featureBar('team-fbar', [
				{ label: 'Football', description: 'Youth (U17)' },
				{ label: 'Emndozo, KwaGucingo', description: 'KwaZulu-Natal' },
				{ label: 'Season 2026', description: 'Active pilot' },
				{ label: 'Team-led', description: 'Operational owner: team' },
			]),
			mediaSplit('team-split', 'ABOUT THE CLUB',
				'Grassroots football, locally owned.',
				'Unami Stars is part of the Unami Sports programme — a community-first operating model that gives grassroots teams a digital home, shared tools and practical support while keeping the club fully team-led. The Foundation donates the platform; the team runs the club.',
				[cta('team-split-cta', 'How the partnership works', '/our-model', 'default')],
				false
			),
			cardList('team-cards', 'WHAT THE DEMO SHOWS',
				'A full team presence — fixtures, governance, development and more.',
				[
					{ eyebrow: 'PUBLIC PROFILE', heading: 'Team identity and community story', body: 'Approved team description, sport, community, province and season — all managed by the team through the CMS.' },
					{ eyebrow: 'FIXTURES', heading: 'Scheduled matches and results', body: 'Public fixture listings appear only after publication checks. Results are added by the team after each match.' },
					{ eyebrow: 'EVENTS', heading: 'Community events and festivals', body: 'The KwaGucingo Community Football Day demonstrates how a one-day festival is listed after safety, venue and budget readiness checks.' },
					{ eyebrow: 'GOVERNANCE', heading: 'Safeguarding and policy starters', body: 'Draft governance documents give teams a starting point — not an adopted policy. Each team adapts and approves its own.' },
					{ eyebrow: 'DEVELOPMENT', heading: 'Capability and training pathway', body: 'Training sessions, support requests and pilot stages are tracked operationally — not publicly listed.' },
					{ eyebrow: 'GET INVOLVED', heading: 'Support and partnership routes', body: 'Ethical sponsorship, in-kind support and volunteer contributions are explored through a transparent approval process.' },
				]
			),
			countdown('team-countdown', 'NEXT COMMUNITY EVENT',
				'KwaGucingo Community Football Day',
				'2026-12-06T09:00:00+02:00',
				[cta('team-countdown-cta', 'View event details', '/events', 'default')]
			),
			callout('team-callout', 'PILOT STATUS',
				'Prototype assembled. Pilot not yet activated.',
				'A real start requires team-authorised participation, agreed responsibilities and exit terms, safeguarding arrangements, a data plan, trained team editors and tested least-privilege access.',
				[cta('team-callout-cta', 'Read the operating model', '/our-model', 'default')]
			),
		],
	})

	return pages
}

function buildPages2() {
	const pages = []

	// ── OUR MODEL ─────────────────────────────────────────────────────────
	pages.push({
		_id: 'unami.page.model',
		_type: 'page',
		title: 'The SOP Model',
		metadata: {
			_type: 'metadata',
			title: 'The Community Sports Operating Partnership model',
			description: 'How Unami Sports works: a team-led, Foundation-supported operating partnership that keeps sporting decisions in community hands.',
			slug: { _type: 'slug', current: 'our-model' },
			noIndex: false,
		},
		modules: [
			heroSplit('model-hero', 'THE OPERATING MODEL',
				'A partnership — not a takeover.',
				'The Community Sports Operating Partnership (CSOP) is the relationship through which a participating team leads its affairs while Unami Foundation provides agreed infrastructure, training, maintenance, support and stakeholder coordination.',
				[cta('model-cta1', 'See Unami Stars demo', '/unami-stars', 'default')]
			),
			featureBar('model-fbar', [
				{ label: 'Team authority', description: 'Sporting decisions stay local' },
				{ label: 'Donated infrastructure', description: 'Platform, CMS, hosting' },
				{ label: 'Practical training', description: 'Two editors minimum' },
				{ label: 'Transparent support', description: 'Defined scope and limits' },
				{ label: 'Safe exit', description: 'Content export and handover' },
			]),
			tabbedContent('model-tabs', 'THREE DOMAINS',
				'The separation of concerns is a product principle.',
				[
					{
						label: 'Team-controlled',
						blocks: [
							block('model-t0a', 'The team leads and approves its sporting decisions, coaching approach, team selection, local schedules, who represents the team, which content stays private, and all local governance and finance.', 'normal'),
							block('model-t0b', 'Team-controlled does not mean every volunteer accesses every record. The club nominates appropriate adult roles and reviews them periodically.', 'normal'),
						],
						ctas: [cta('model-t0cta', 'View Unami Stars', '/unami-stars', 'default')],
					},
					{
						label: 'Foundation-stewarded',
						blocks: [
							block('model-t1a', 'Unami Foundation coordinates stewardship of shared digital infrastructure, onboarding, platform training, maintenance, technical support, stakeholder relationships where agreed, and continuity planning.', 'normal'),
							block('model-t1b', 'The Foundation does not claim ownership of a team\'s sporting authority or use team information for stakeholder promotion beyond agreed purposes.', 'normal'),
						],
					},
					{
						label: 'Jointly agreed',
						blocks: [
							block('model-t2a', 'Some matters require explicit agreement: pilot scope and success measures, support hours and escalation, customisations that affect shared infrastructure, public use of team names and photos, safeguarding processes, data responsibilities, incident response and exit.', 'normal'),
						],
					},
				]
			),
			statList('model-stats', 'THE SERVICE CATALOGUE',
				'Five bounded service areas.',
				[
					{ value: '1', suffix: '', label: 'Donated digital infrastructure' },
					{ value: '2', suffix: '+', label: 'Editors trained per team' },
					{ value: '5', suffix: '', label: 'Pilot readiness gates' },
					{ value: '12', suffix: '', label: 'Operating principles' },
				]
			),
			stepList('model-steps', 'PILOT LIFECYCLE',
				'A responsible pilot has gates — not just a website.',
				[
					{ heading: 'Verify and listen', body: 'Confirm team identity, local priorities, adult contacts, authority to participate and preferred language and access needs.' },
					{ heading: 'Agree boundaries', body: 'Document roles, publication approvals, data responsibilities, support scope, costs, complaints and exit or transfer.' },
					{ heading: 'Safeguarding and access readiness', body: 'Name a competent safeguarding lead, agree reporting routes, assess data collection, configure accounts and roles.' },
					{ heading: 'Configure and train', body: 'Confirm site identity, pages, contacts and team records. Train at least two nominated adult administrators where feasible.' },
					{ heading: 'Limited launch and review', body: 'Publish only approved pages. Monitor errors and support requests. Gather team feedback and decide: continue, change, pause or exit.' },
				]
			),
			callout('model-callout', 'READY TO EXPLORE?',
				'Start a conversation about a community sports operating partnership.',
				'Whether you represent a grassroots team, a local authority, a funder or a sport body — get in touch to discuss how the model could work for your community.',
				[cta('model-callout-cta', 'Get in touch', '/contact', 'default')]
			),
		],
	})

	// ── DEVELOPMENT ───────────────────────────────────────────────────────
	pages.push({
		_id: 'unami.page.development',
		_type: 'page',
		title: 'Development',
		metadata: {
			_type: 'metadata',
			title: 'Development — Unami Stars capability pathway',
			description: 'How Unami Sports builds local capability: onboarding, training, support and the pilot lifecycle for community teams.',
			slug: { _type: 'slug', current: 'development' },
			noIndex: false,
		},
		modules: [
			heroCover('dev-hero', 'CAPABILITY DEVELOPMENT',
				'Capability over dependency.',
				'Training, documentation and administrator handover are part of the service — not optional extras. The goal is a team that can operate confidently, not one that relies on the Foundation for every update.',
				[], { textAlign: 'left' }
			),
			featureBar('dev-fbar', [
				{ label: 'Observe', description: 'Foundation demonstrates the workflow' },
				{ label: 'Practise together', description: 'Administrators perform tasks with support' },
				{ label: 'Operate locally', description: 'Team handles routine updates' },
				{ label: 'Handover confidently', description: 'Backup administrator maintains continuity' },
				{ label: 'Improve together', description: 'Team proposes changes; Foundation evaluates' },
			]),
			cardList('dev-cards', 'WHAT ONBOARDING COVERS',
				'Task-based, accessible training for nominated adult editors.',
				[
					{ eyebrow: 'ACCESS', heading: 'Signing in securely', body: 'Understanding authorised roles, least-privilege access and what each editor can and cannot do in the CMS.' },
					{ eyebrow: 'CONTENT', heading: 'Editing and publishing', body: 'Drafting, previewing, approving and publishing pages, team descriptions, navigation and contact routes.' },
					{ eyebrow: 'FIXTURES', heading: 'Managing fixtures safely', body: 'Creating and updating fixtures without exposing unsafe venue or travel details. Understanding publication checks.' },
					{ eyebrow: 'IMAGES', heading: 'Adding images responsibly', body: 'Adding images only with appropriate rights, alt text and consent. No youth images without a documented process.' },
					{ eyebrow: 'SUPPORT', heading: 'Raising support requests', body: 'Knowing how to log a routine platform issue, what is out of scope and how to escalate urgent matters.' },
					{ eyebrow: 'HANDOVER', heading: 'Handing over when someone leaves', body: 'A backup administrator can maintain continuity. Account offboarding and credential rotation are part of the process.' },
				]
			),
			mediaSplit('dev-split', 'DEMO TRAINING RECORD',
				'Two sessions delivered in August 2026.',
				'The Unami Stars demo includes two illustrative training records: site and page editing, and privacy and safeguarding. These are demonstration workflow examples — not evidence of delivered training with a real team.',
				[cta('dev-split-cta', 'View the operating model', '/our-model', 'default')],
				true
			),
			callout('dev-callout', 'PILOT READINESS',
				'Training is one of five readiness gates.',
				'A real pilot also requires team-authorised participation, agreed service boundaries, safeguarding arrangements, tested least-privilege access and a data plan before any public launch.',
				[cta('dev-callout-cta', 'Read the full model', '/our-model', 'default')]
			),
		],
	})

	return pages
}

function buildPages3() {
	const pages = []

	// ── FIXTURES (CMS page — slug changed to avoid collision with /fixtures sports route) ──
	pages.push({
		_id: 'unami.page.fixtures',
		_type: 'page',
		title: 'Fixtures',
		metadata: {
			_type: 'metadata',
			title: 'Fixtures and results — Unami Stars',
			description: 'Approved public fixtures and results for Unami Stars. Listings appear only after publication checks are complete.',
			slug: { _type: 'slug', current: 'fixtures' },
			noIndex: false,
		},
		modules: [
			heroCover('fix-hero', 'FIXTURES AND RESULTS',
				'Scheduled matches and completed results.',
				'Public fixture listings appear only when a record meets its publication and readiness checks. Private venue details and match reports are not displayed.',
				[cta('fix-cta', 'View all sports data', '/sports', 'ghost')],
				{ textAlign: 'left' }
			),
			banner('fix-banner',
				'Live fixture data is shown on the /sports directory. This page explains how fixture publication works.',
				'subtle'
			),
			cardList('fix-cards', 'HOW FIXTURE PUBLICATION WORKS',
				'Three checks before a fixture goes public.',
				[
					{ eyebrow: 'TEAM APPROVAL', heading: 'The team confirms accuracy', body: 'The team editor sets publicListing to true only after confirming the opponent, date, time and venue are correct and approved for publication.' },
					{ eyebrow: 'SAFETY REVIEW', heading: 'No unsafe venue details', body: 'Detailed venue addresses, travel routes and private ground information are not published. Only the public venue name is shown.' },
					{ eyebrow: 'STATUS CHECK', heading: 'Scheduled or completed only', body: 'Only fixtures with status "scheduled" or "completed" appear publicly. Postponed, cancelled or draft fixtures are not listed.' },
				]
			),
			stepList('fix-steps', 'ADDING A RESULT',
				'How a completed fixture gets its result.',
				[
					{ heading: 'Match is played', body: 'The team editor opens the fixture record in the CMS after the match.' },
					{ heading: 'Score is entered', body: 'Home score and away score are entered. Status is changed to "completed".' },
					{ heading: 'Published', body: 'The fixture is published. The result appears on the public fixtures page within the next revalidation cycle.' },
				]
			),
			countdown('fix-countdown', 'NEXT FIXTURE',
				'Unami Stars vs KwaGucingo Select',
				'2026-12-06T11:00:00+02:00',
				[cta('fix-countdown-cta', 'View sports directory', '/sports', 'default')]
			),
			callout('fix-callout', 'SPORTS DIRECTORY',
				'All public fixtures, events and competitions in one place.',
				'The sports directory shows live data from all active public teams — not just Unami Stars.',
				[cta('fix-callout-cta', 'Go to sports directory', '/sports', 'default')]
			),
		],
	})

	// ── GOVERNANCE ────────────────────────────────────────────────────────
	pages.push({
		_id: 'unami.page.governance',
		_type: 'page',
		title: 'Governance',
		metadata: {
			_type: 'metadata',
			title: 'Governance — Unami Stars',
			description: 'How Unami Stars and Unami Foundation approach governance, safeguarding, data and accountability.',
			slug: { _type: 'slug', current: 'governance' },
			noIndex: false,
		},
		modules: [
			heroCover('gov-hero', 'GOVERNANCE AND ACCOUNTABILITY',
				'Responsible sport starts with clear roles.',
				'Good governance is not a document — it is a practice. This page outlines how Unami Stars and Unami Foundation approach decision-making, safeguarding, data and accountability.',
				[], { textAlign: 'left' }
			),
			cardList('gov-cards', 'GOVERNANCE AREAS',
				'Four areas every participating team should address.',
				[
					{ eyebrow: 'LEGAL IDENTITY', heading: 'Organisation and constitution', body: 'A team may be an informal group, a club, an association or a non-profit entity. Each pilot team confirms its structure, governing instrument and who has authority to approve participation.' },
					{ eyebrow: 'SAFEGUARDING', heading: 'Youth protection and consent', body: 'A named safeguarding lead, trusted reporting routes, adult boundaries, photography and publication consent, and a distinction between ordinary administration and sensitive case information.' },
					{ eyebrow: 'DATA', heading: 'Information and privacy', body: 'Collect only what is needed. Explain purpose. Limit access and retention. Keep sensitive safeguarding details out of the general CMS. Provide a correction and takedown route.' },
					{ eyebrow: 'FINANCE', heading: 'Funds and accountability', body: 'Team funds and decisions remain under team controls. Any fee must be transparent and proportionate. Restricted grants may only be used according to their conditions.' },
				]
			),
			accordionList('gov-faq', 'COMMON QUESTIONS',
				'Governance questions teams ask during onboarding.',
				[
					{ summary: 'Who owns the team\'s content?', body: 'The team owns its identity, approved public story and sporting decisions. Unami Foundation provides publishing tools and support but does not claim ownership of team-authored content.' },
					{ summary: 'What happens if the Foundation can no longer support the platform?', body: 'The continuity plan documents what accounts, domains and data the Foundation manages, how the team exports its content, and how the team can pause or exit without losing its identity.' },
					{ summary: 'Are the CMS ownership labels access controls?', body: 'No. Fields like operationalOwner and guardianConsent are workflow and editorial fields — not technical access controls. Actual permissions must be configured and tested in Sanity roles.' },
					{ summary: 'Do we need a constitution?', body: 'A template is provided as a starting point covering name and purpose, membership, committee roles, meetings, finances, safeguarding, complaints and closure. Each team must adapt and approve its own document through its valid process.' },
					{ summary: 'How are youth player profiles handled?', body: 'Publication defaults to off. No date of birth field is stored. Public listing requires approved guardian consent. The CMS is not a complete safeguarding or consent-record system.' },
				]
			),
			mediaSplit('gov-split', 'DRAFT GOVERNANCE DOCUMENTS',
				'Starters — not adopted policies.',
				'The Unami Stars demo includes a draft safeguarding policy kept as an unpublished CMS document. It is a starter template only. Each team must obtain appropriate South African legal and football-association review before adoption.',
				[], false
			),
			callout('gov-callout', 'QUESTIONS?',
				'Governance is a conversation, not a checklist.',
				'If you have questions about how governance works in the Unami Sports model, get in touch.',
				[cta('gov-callout-cta', 'Contact us', '/contact', 'default')]
			),
		],
	})

	// ── GET INVOLVED ──────────────────────────────────────────────────────
	pages.push({
		_id: 'unami.page.get-involved',
		_type: 'page',
		title: 'Get Involved',
		metadata: {
			_type: 'metadata',
			title: 'Get involved — support Unami Sports',
			description: 'Ways to support Unami Sports: ethical sponsorship, in-kind contributions, volunteering, expertise and community partnerships.',
			slug: { _type: 'slug', current: 'get-involved' },
			noIndex: false,
		},
		modules: [
			heroCover('gi-hero', 'GET INVOLVED',
				'Help community sport stay community-led.',
				'Unami Sports is exploring ethical, transparent ways to sustain the programme. No funding or commercial partner is represented as secured. All support is subject to written terms, conflict review and team approval.',
				[], { textAlign: 'left' }
			),
			cardList('gi-cards', 'WAYS TO SUPPORT',
				'Six routes — each with clear boundaries.',
				[
					{ eyebrow: 'GRANTS AND DONATIONS', heading: 'Philanthropic support', body: 'Grants and donations for community access and shared infrastructure. Restricted funds are used only according to their conditions.' },
					{ eyebrow: 'ETHICAL SPONSORSHIP', heading: 'Team and event sponsorship', body: 'Sponsors receive only the recognition written in an approved agreement. They do not gain access to children, personal data, team selection or editorial control.' },
					{ eyebrow: 'IN-KIND SUPPORT', heading: 'Equipment, facilities, connectivity', body: 'In-kind contributions are recorded transparently and never described as cash income. Donated equipment remains under agreed ownership.' },
					{ eyebrow: 'EXPERTISE', heading: 'Skills and knowledge', body: 'Legal, safeguarding, sport-governance, technical or community expertise. Volunteer time is valued and its limits respected.' },
					{ eyebrow: 'COMMUNITY PARTNERSHIP', heading: 'Local organisations', body: 'Associations, schools, health services and local authorities can support teams within clear, agreed boundaries. No implied endorsement without written permission.' },
					{ eyebrow: 'PAID SERVICES', heading: 'Organisations able to pay', body: 'Training, template adaptation or technical services for organisations with resources — where this does not reduce support promised to pilot teams.' },
				]
			),
			testimonialFeature('gi-testimonial',
				'Commercial thinking is important because infrastructure, staff time, travel, officials, venues, safety arrangements and maintenance have real costs. A non-profit can plan for earned income where it is lawful, consistent with its governing documents and appropriately governed.',
				'Unami Sports operating model',
				'Mission-aligned commercial and sustainability layer'
			),
			accordionList('gi-faq', 'BEFORE ANY COMMERCIAL OFFER',
				'Six questions every partnership must answer.',
				[
					{ summary: 'Who can negotiate and sign?', body: 'Confirm who can negotiate, sign, invoice, collect, authorise expenditure and report funds. The same person should not hold all of these roles.' },
					{ summary: 'What do sponsors receive?', body: 'Sponsors receive only the recognition and deliverables written in an approved agreement. They do not gain access to children, personal data, team selection or editorial control.' },
					{ summary: 'How are conflicts of interest managed?', body: 'Disclose sponsorship conditions, conflicts of interest, related-party benefits and allocation of proceeds before any agreement is signed.' },
					{ summary: 'What are the tax and legal implications?', body: 'Confirm tax, company, charity, fundraising, consumer, employment, competition and sport-governance implications with qualified South African advisers.' },
					{ summary: 'How is restricted funding tracked?', body: 'Restricted grants and sponsor funds may only be used according to their conditions. Do not describe gross sponsorship or projected event revenue as net resources available to teams.' },
				]
			),
			callout('gi-callout', 'START A CONVERSATION',
				'No commitment required to make contact.',
				'If you are interested in supporting Unami Sports — as a funder, sponsor, volunteer or community partner — get in touch. We will explain what is possible, what the boundaries are and what the process looks like.',
				[cta('gi-callout-cta', 'Contact us', '/contact', 'default')]
			),
		],
	})

	return pages
}

function buildPages4() {
	const pages = []

	// ── CONTACT ───────────────────────────────────────────────────────────
	pages.push({
		_id: 'unami.page.contact',
		_type: 'page',
		title: 'Contact',
		metadata: {
			_type: 'metadata',
			title: 'Contact — Unami Sports',
			description: 'Get in touch with Unami Sports about the programme, a community sports operating partnership, or ways to support.',
			slug: { _type: 'slug', current: 'contact' },
			noIndex: false,
		},
		modules: [
			heroCover('con-hero', 'CONTACT',
				'Get in touch.',
				'This is a demonstration site. No real contact details have been added yet. In a live deployment, this page would include an approved contact inbox, a form module and clear information about who responds and when.',
				[], { textAlign: 'left' }
			),
			banner('con-banner',
				'Demo site — contact details have not been added. This page shows the intended structure.',
				'subtle'
			),
			cardList('con-cards', 'WHO TO CONTACT',
				'Three routes depending on your enquiry.',
				[
					{ eyebrow: 'GENERAL ENQUIRIES', heading: 'About the programme', body: 'Questions about Unami Sports, the operating model, how to get involved or how the platform works. Responded to by the Foundation programme steward.' },
					{ eyebrow: 'TEAM SUPPORT', heading: 'Platform and content help', body: 'Routine platform issues, content questions or training follow-up for participating teams. Logged as a support request and triaged by the Foundation technical steward.' },
					{ eyebrow: 'PARTNERSHIPS', heading: 'Funding, sponsorship and expertise', body: 'Enquiries about supporting the programme as a funder, sponsor, volunteer or community partner. Subject to conflict review and written terms.' },
				]
			),
			mediaSplit('con-split', 'WHAT TO EXPECT',
				'Honest about capacity.',
				'Unami Sports is a small programme. Response times depend on available capacity. We will acknowledge your message, explain what we can help with and be clear about what is outside our current scope.',
				[], true
			),
		],
	})

	// ── ACCESSIBILITY ─────────────────────────────────────────────────────
	pages.push({
		_id: 'unami.page.accessibility',
		_type: 'page',
		title: 'Accessibility',
		metadata: {
			_type: 'metadata',
			title: 'Accessibility statement — Unami Sports',
			description: 'Unami Sports accessibility statement: our commitment, known limitations and how to report issues.',
			slug: { _type: 'slug', current: 'accessibility-statement' },
			noIndex: false,
		},
		modules: [
			heroCover('a11y-hero', 'ACCESSIBILITY STATEMENT',
				'Accessible by design.',
				'Unami Sports is committed to making this website accessible to as many people as possible. This statement explains our approach, known limitations and how to report issues.',
				[], { textAlign: 'left' }
			),
			prose('a11y-prose', [
				block('a11y-p1', 'Accessibility approach', 'h2'),
				block('a11y-p2', 'This site is built on SanityPress with Next.js and Tailwind CSS. We aim to meet WCAG 2.1 Level AA. Pages use semantic HTML, logical heading order, sufficient colour contrast and keyboard-navigable components.'),
				block('a11y-p3', 'Known limitations', 'h2'),
				block('a11y-p4', 'This is a demonstration site. Some pages contain placeholder content. Images do not yet have verified alt text. No real contact route has been added. These will be addressed before any public launch with a real participating team.'),
				block('a11y-p5', 'Reporting issues', 'h2'),
				block('a11y-p6', 'If you experience an accessibility barrier on this site, please contact us. We will acknowledge your report and aim to resolve or explain the issue within a reasonable timeframe.'),
				block('a11y-p7', 'Technical information', 'h2'),
				block('a11y-p8', 'This site relies on JavaScript for some interactive components including the countdown timer, tabbed content and accordion modules. Core content is accessible without JavaScript. The site uses system fonts and respects prefers-reduced-motion and prefers-color-scheme media queries.'),
			]),
			callout('a11y-callout', 'FOUND AN ISSUE?',
				'Tell us about it.',
				'Accessibility feedback helps us improve the platform for all participating teams and their communities.',
				[cta('a11y-callout-cta', 'Contact us', '/contact', 'default')]
			),
		],
	})

	// ── 404 ───────────────────────────────────────────────────────────────
	pages.push({
		_id: 'unami.page.not-found',
		_type: 'page',
		title: 'Page Not Found',
		metadata: {
			_type: 'metadata',
			title: 'Page not found — Unami Sports',
			description: 'The page you are looking for could not be found.',
			slug: { _type: 'slug', current: '404' },
			noIndex: true,
		},
		modules: [
			heroCover('nf-hero', '404',
				'Page not found.',
				'The page you are looking for does not exist or has moved. Try the links below to find what you need.',
				[
					cta('nf-cta1', 'Go home', '/', 'default'),
					cta('nf-cta2', 'Sports directory', '/sports', 'ghost'),
				],
				{ textAlign: 'center', verticalAlign: 'center' }
			),
		],
	})

	return pages
}

// ── Cleanup: delete duplicate seed.sports.* docs that clash ───────────────

async function cleanDuplicates() {
	// seed.sports.fixture.* reference seed.sports.team.unami-stars
	// unami.demo.* reference unami.sports-team.unami-stars (demoRecord:true, publicProfile:false — safe)
	// Delete the unami.demo.* competition/event that duplicate seed.sports.* ones
	// Keep seed.sports.* as the canonical public records
	const toDelete = [
		'unami.demo.competition.community-day',
		'unami.demo.event.community-day',
		'unami.demo.commercial.sponsorship-framework',
		'unami.demo.pilot.stars',
		'unami.demo.support.publishing',
		'unami.demo.training.team-admin',
		'unami.demo.resource.platform-support',
	]
	const tx = client.transaction()
	for (const id of toDelete) tx.delete(id)
	await tx.commit({ visibility: 'async' })
	console.log(`  ✓ Deleted ${toDelete.length} duplicate demo docs`)
}

// ── Upsert ─────────────────────────────────────────────────────────────────

async function upsertPages(pages) {
	const tx = client.transaction()
	for (const doc of pages) tx.createOrReplace(doc)
	await tx.commit({ visibility: 'async' })
}

// ── Main ───────────────────────────────────────────────────────────────────

async function seed() {
	console.log('Cleaning duplicate docs...')
	await cleanDuplicates()

	const allPages = [
		...buildPages(),
		...buildPages2(),
		...buildPages3(),
		...buildPages4(),
	]

	console.log(`Upserting ${allPages.length} pages...`)
	await upsertPages(allPages)
	console.log(`  ✓ ${allPages.length} pages upserted`)

	// Verify slugs
	await new Promise(r => setTimeout(r, 2000))
	const slugs = await client.fetch(
		`*[_type=='page']{_id, 'slug': metadata.slug.current, 'moduleCount': count(modules)} | order(slug asc)`
	)
	console.log('\nPages:')
	slugs.forEach(p => console.log(`  /${p.slug === 'index' ? '' : p.slug} — ${p.moduleCount} modules (${p._id})`))

	const moduleCounts = slugs.map(p => p.moduleCount)
	const total = moduleCounts.reduce((a, b) => a + b, 0)
	console.log(`\nTotal modules across all pages: ${total}`)
	console.log('\n✓ seed-pages complete')
}

seed().catch(err => { console.error(err.message); process.exitCode = 1 })
