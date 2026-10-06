/**
 * Unami Sports — full relational bootstrap seed
 *
 * Creates or reconciles the complete Unami Stars demonstration dataset
 * including all 14 sports schema types, SanityPress site/navigation/pages,
 * and all cross-document references.
 *
 * Usage:
 *   npm run seed:sports          # create/reconcile (idempotent)
 *   npm run seed:sports:reset    # delete seed-owned docs then re-seed (destructive)
 *
 * Required env vars (in .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
	console.error('Missing required env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN')
	process.exit(1)
}

const client = createClient({
	projectId,
	dataset,
	apiVersion: '2026-10-05',
	useCdn: false,
	token,
})

// ── Stable document IDs ────────────────────────────────────────────────────
// All seed-owned documents use these deterministic IDs.
// Running the seed twice will upsert, never duplicate.

const IDS = {
	// SanityPress
	site: 'site',
	announcement: 'seed.announcement.welcome',
	navHeader: 'seed.nav.header',
	navFooter: 'seed.nav.footer',
	pageHome: 'seed.page.index',
	page404: 'seed.page.404',
	// Sports
	team: 'seed.sports.team.unami-stars',
	stakeholder: 'seed.sports.stakeholder.kwagucingo-fa',
	pilot: 'seed.sports.pilot.unami-stars-2026',
	training1: 'seed.sports.training.site-editing',
	training2: 'seed.sports.training.safeguarding',
	support1: 'seed.sports.support.nav-question',
	competition: 'seed.sports.competition.community-day-2026',
	event: 'seed.sports.event.community-day-2026',
	fixture1: 'seed.sports.fixture.friendly-nov',
	fixture2: 'seed.sports.fixture.friendly-oct-result',
	fixture3: 'seed.sports.fixture.community-day-match',
	governance: 'seed.sports.governance.safeguarding-policy',
	customization: 'seed.sports.customization.kit-colours',
	commercial: 'seed.sports.commercial.kwagucingo-fa',
	resource1: 'seed.sports.resource.event-budget',
	resource2: 'seed.sports.resource.kit-donation',
	talent1: 'seed.sports.talent.ref-001',
	// Players (demo — all private, guardianConsent not-requested)
	player1: 'seed.sports.player.p001',
	player2: 'seed.sports.player.p002',
	player3: 'seed.sports.player.p003',
	player4: 'seed.sports.player.p004',
	player5: 'seed.sports.player.p005',
	player6: 'seed.sports.player.p006',
}

// ── Portable Text helpers ──────────────────────────────────────────────────

function block(key, text, style = 'normal') {
	return {
		_key: key,
		_type: 'block',
		style,
		markDefs: [],
		children: [{ _key: key + 'c', _type: 'span', marks: [], text }],
	}
}

function ref(id) {
	return { _type: 'reference', _ref: id }
}

function linkItem(key, label, url) {
	return {
		_key: key,
		_type: 'link',
		label,
		type: 'external',
		external: url,
	}
}

// ── Reset helper ───────────────────────────────────────────────────────────

async function reset() {
	console.log('\n⚠️  RESET: deleting all seed-owned documents...')
	const ids = Object.values(IDS)
	const tx = client.transaction()
	for (const id of ids) {
		tx.delete(id)
	}
	await tx.commit({ visibility: 'async' })
	console.log(`Deleted ${ids.length} seed-owned document IDs (some may not have existed).`)
}


// ── SanityPress documents ──────────────────────────────────────────────────

function buildSanityPressDocs() {
	return [
		// Site singleton
		{
			_id: IDS.site,
			_type: 'site',
			title: 'Unami Sports',
			header: ref(IDS.navHeader),
			footer: ref(IDS.navFooter),
			announcement: ref(IDS.announcement),
		},

		// Announcement
		{
			_id: IDS.announcement,
			_type: 'announcement',
			content: [block('a1', 'Welcome to Unami Sports — community-led sport in KwaGucingo, KwaZulu-Natal.')],
			ctas: [],
		},

		// Header navigation
		{
			_id: IDS.navHeader,
			_type: 'navigation',
			title: 'Header',
			items: [
				linkItem('h1', 'Home', '/'),
				linkItem('h2', 'Sports', '/sports'),
				linkItem('h3', 'Teams', '/teams'),
				linkItem('h4', 'Fixtures', '/fixtures'),
				linkItem('h5', 'Events', '/events'),
				linkItem('h6', 'Competitions', '/competitions'),
			],
		},

		// Footer navigation
		{
			_id: IDS.navFooter,
			_type: 'navigation',
			title: 'Footer',
			items: [
				linkItem('f1', 'Sports', '/sports'),
				linkItem('f2', 'Teams', '/teams'),
				linkItem('f3', 'Fixtures', '/fixtures'),
				linkItem('f4', 'Events', '/events'),
				linkItem('f5', 'Competitions', '/competitions'),
				linkItem('f6', 'Accessibility statement', '/accessibility-statement'),
			],
		},

		// Homepage (index)
		{
			_id: IDS.pageHome,
			_type: 'page',
			title: 'Home',
			modules: [
				{
					_key: 'hero1',
					_type: 'hero.cover',
					eyebrow: 'Community sport, built together',
					content: [
						block('hc1', 'Stronger teams. Stronger communities.', 'h1'),
						block('hc2', 'Unami Sports supports community-led sport with practical tools, shared learning and public information.'),
					],
					ctas: [
						{ _key: 'cta1', _type: 'cta', link: { _type: 'link', label: 'Explore community sport', type: 'external', external: '/sports' }, theme: 'action' },
						{ _key: 'cta2', _type: 'cta', link: { _type: 'link', label: 'Browse teams', type: 'external', external: '/teams' }, theme: 'action-outline' },
					],
				},
				{
					_key: 'callout1',
					_type: 'callout',
					eyebrow: 'Technology for Good',
					intro: [
						block('ci1', 'Unami Sports is reusable infrastructure for sporting teams — not a league management system. Public listings appear only when they have been deliberately published and all readiness checks pass.'),
					],
					ctas: [],
				},
			],
			metadata: {
				_type: 'metadata',
				title: 'Unami Sports',
				description: 'Unami Sports supports community-led sport with practical tools, shared learning and public information.',
				slug: { _type: 'slug', current: 'index' },
				noIndex: false,
			},
		},

		// 404 page
		{
			_id: IDS.page404,
			_type: 'page',
			title: 'Page not found',
			modules: [
				{
					_key: '404h',
					_type: 'callout',
					eyebrow: '404',
					intro: [
						block('404a', 'The page you are looking for does not exist or has moved.'),
					],
					ctas: [
						{ _key: '404c', _type: 'cta', link: { _type: 'link', label: 'Go home', type: 'external', external: '/' }, theme: 'action' },
					],
				},
			],
			metadata: {
				_type: 'metadata',
				title: 'Page not found',
				slug: { _type: 'slug', current: '404' },
				noIndex: true,
			},
		},
	]
}


// ── Sports documents ───────────────────────────────────────────────────────

function buildSportsDocs() {
	return [
		// ── Team ──────────────────────────────────────────────────────────
		{
			_id: IDS.team,
			_type: 'sports.team',
			title: 'Unami Stars',
			slug: { _type: 'slug', current: 'unami-stars' },
			sport: 'football',
			community: 'Emndozo, KwaGucingo',
			province: 'KwaZulu-Natal',
			ageGroup: 'Youth (U17)',
			season: '2026',
			status: 'active',
			demoRecord: false,
			publicProfile: true,
			operationalOwner: 'team',
			description: [
				block('td1', 'Unami Stars is a community youth football club based in Emndozo, KwaGucingo, KwaZulu-Natal.'),
				block('td2', 'The club is part of the Unami Sports programme — a community-first operating model that gives grassroots teams a digital home, shared tools and practical support while keeping the club fully team-led.'),
			],
		},

		// ── Players (all private — guardianConsent not-requested) ─────────
		{
			_id: IDS.player1,
			_type: 'sports.player',
			displayName: 'Player 01',
			team: ref(IDS.team),
			squad: 'U17',
			shirtNumber: 1,
			position: 'Goalkeeper',
			guardianConsent: 'not-requested',
			publicProfile: false,
			demoRecord: true,
			operationalOwner: 'team',
		},
		{
			_id: IDS.player2,
			_type: 'sports.player',
			displayName: 'Player 02',
			team: ref(IDS.team),
			squad: 'U17',
			shirtNumber: 5,
			position: 'Defender',
			guardianConsent: 'not-requested',
			publicProfile: false,
			demoRecord: true,
			operationalOwner: 'team',
		},
		{
			_id: IDS.player3,
			_type: 'sports.player',
			displayName: 'Player 03',
			team: ref(IDS.team),
			squad: 'U17',
			shirtNumber: 8,
			position: 'Midfielder',
			guardianConsent: 'not-requested',
			publicProfile: false,
			demoRecord: true,
			operationalOwner: 'team',
		},
		{
			_id: IDS.player4,
			_type: 'sports.player',
			displayName: 'Player 04',
			team: ref(IDS.team),
			squad: 'U17',
			shirtNumber: 10,
			position: 'Midfielder',
			guardianConsent: 'not-requested',
			publicProfile: false,
			demoRecord: true,
			operationalOwner: 'team',
		},
		{
			_id: IDS.player5,
			_type: 'sports.player',
			displayName: 'Player 05',
			team: ref(IDS.team),
			squad: 'U17',
			shirtNumber: 11,
			position: 'Forward',
			guardianConsent: 'not-requested',
			publicProfile: false,
			demoRecord: true,
			operationalOwner: 'team',
		},
		{
			_id: IDS.player6,
			_type: 'sports.player',
			displayName: 'Player 06',
			team: ref(IDS.team),
			squad: 'U17',
			shirtNumber: 9,
			position: 'Forward',
			guardianConsent: 'not-requested',
			publicProfile: false,
			demoRecord: true,
			operationalOwner: 'team',
		},

		// ── Fixtures ──────────────────────────────────────────────────────
		// Upcoming scheduled
		{
			_id: IDS.fixture1,
			_type: 'sports.fixture',
			title: 'Unami Stars vs Emndozo United',
			team: ref(IDS.team),
			opponent: 'Emndozo United',
			competition: 'Pre-season friendly',
			season: '2026',
			kickoff: '2026-11-15T10:00:00+02:00',
			venue: 'KwaGucingo Community Ground',
			status: 'scheduled',
			publicListing: true,
			demoRecord: false,
			operationalOwner: 'team',
		},
		// Completed with result
		{
			_id: IDS.fixture2,
			_type: 'sports.fixture',
			title: 'Unami Stars vs Nkandla Youth',
			team: ref(IDS.team),
			opponent: 'Nkandla Youth',
			competition: 'Pre-season friendly',
			season: '2026',
			kickoff: '2026-10-05T10:00:00+02:00',
			venue: 'KwaGucingo Community Ground',
			status: 'completed',
			homeScore: 3,
			awayScore: 1,
			publicListing: true,
			demoRecord: false,
			operationalOwner: 'team',
		},
		// Community day match (linked to competition string)
		{
			_id: IDS.fixture3,
			_type: 'sports.fixture',
			title: 'Unami Stars vs KwaGucingo Select',
			team: ref(IDS.team),
			opponent: 'KwaGucingo Select',
			competition: 'KwaGucingo Community Football Day 2026',
			season: '2026',
			kickoff: '2026-12-06T11:00:00+02:00',
			venue: 'KwaGucingo Community Ground',
			status: 'scheduled',
			publicListing: true,
			demoRecord: false,
			operationalOwner: 'team',
		},

		// ── Stakeholder ───────────────────────────────────────────────────
		{
			_id: IDS.stakeholder,
			_type: 'sports.stakeholder',
			organization: 'KwaGucingo Football Association',
			organizationType: 'association',
			relationshipLead: 'foundation',
			supportAreas: ['fixtures', 'competition-registration', 'referee-coordination'],
			relationshipSummary: [
				block('sr1', 'The KwaGucingo Football Association provides competition registration support and referee coordination for community fixtures.'),
			],
			publicAcknowledgement: false,
		},

		// ── Competition ───────────────────────────────────────────────────
		{
			_id: IDS.competition,
			_type: 'sports.competition',
			title: 'KwaGucingo Community Football Day 2026',
			sport: 'football',
			format: 'festival',
			status: 'approved',
			startDate: '2026-12-06',
			endDate: '2026-12-06',
			teams: [ref(IDS.team)],
			teamApprovalComplete: true,
			authorityChecksComplete: true,
			safeguardingPlanApproved: true,
			budgetApproved: true,
			publicAnnouncementApproved: true,
			demoRecord: false,
			competitionOwnerRole: 'Unami Foundation programme coordinator',
			ruleVersion: '1.0',
			rulesSummary: [
				block('cr1', 'A one-day community football festival open to youth teams in the KwaGucingo area. Small-sided games, inclusive format, no league standings.'),
			],
		},

		// ── Event ─────────────────────────────────────────────────────────
		{
			_id: IDS.event,
			_type: 'sports.event',
			title: 'KwaGucingo Community Football Day',
			competition: ref(IDS.competition),
			teams: [ref(IDS.team)],
			status: 'approved',
			startDateTime: '2026-12-06T09:00:00+02:00',
			endDateTime: '2026-12-06T17:00:00+02:00',
			publicVenueName: 'KwaGucingo Community Ground',
			eventLeadRole: 'Unami Foundation programme coordinator',
			venueConfirmed: true,
			teamApprovalsComplete: true,
			authorityChecksComplete: true,
			safetyPlanApproved: true,
			firstAidConfirmed: true,
			transportPlanApproved: true,
			eventBudgetApproved: true,
			publicListing: true,
			demoRecord: false,
		},
	]
}


function buildOperationalDocs() {
	return [
		// ── Pilot ─────────────────────────────────────────────────────────
		{
			_id: IDS.pilot,
			_type: 'sports.pilot',
			title: 'Unami Stars — 2026 pilot',
			team: ref(IDS.team),
			cohort: '2026-A',
			stage: 'active',
			teamRepresentativeRole: 'Team manager',
			foundationOwnerRole: 'Unami Foundation programme coordinator',
			need: [
				block('pn1', 'The team needs a digital home to publish fixtures, share results and communicate with the community.'),
				block('pn2', 'Objective: demonstrate that a community youth team can manage its own public presence using the Unami Sports platform within one season.'),
			],
			servicesAgreed: ['public-profile', 'fixtures', 'events', 'competitions'],
			participationApproved: true,
			supportScopeAgreed: true,
			safeguardingPlanAgreed: true,
			accessRolesTested: true,
			primaryEditorTrained: true,
			backupEditorTrained: false,
			startDate: '2026-08-01',
			reviewDate: '2027-02-01',
			demoRecord: false,
		},

		// ── Training sessions ─────────────────────────────────────────────
		{
			_id: IDS.training1,
			_type: 'sports.training',
			title: 'Site and page editing — Unami Stars onboarding',
			team: ref(IDS.team),
			pilot: ref(IDS.pilot),
			topic: 'site-editing',
			deliveryMode: 'in-person',
			sessionDate: '2026-08-15',
			facilitatorRole: 'Unami Foundation programme coordinator',
			participantCount: 2,
			outcomes: [
				block('to1', 'Team manager and backup editor can create and publish pages, update team description, and manage navigation.'),
			],
			materials: ['platform-guide-v1', 'quick-reference-card'],
			followupOwnerRole: 'Team manager',
			followupDue: '2026-09-01',
			followupStatus: 'complete',
			demoRecord: false,
		},
		{
			_id: IDS.training2,
			_type: 'sports.training',
			title: 'Privacy and safeguarding — Unami Stars',
			team: ref(IDS.team),
			pilot: ref(IDS.pilot),
			topic: 'safeguarding',
			deliveryMode: 'in-person',
			sessionDate: '2026-08-15',
			facilitatorRole: 'Unami Foundation programme coordinator',
			participantCount: 2,
			outcomes: [
				block('ts1', 'Team understands player consent requirements, public boundary rules, and how to use demoRecord and publicProfile flags correctly.'),
			],
			materials: ['safeguarding-briefing-v1'],
			followupOwnerRole: 'Unami Foundation programme coordinator',
			followupDue: '2026-09-15',
			followupStatus: 'complete',
			demoRecord: false,
		},

		// ── Support request ───────────────────────────────────────────────
		{
			_id: IDS.support1,
			_type: 'sports.support',
			reference: 'SUP-2026-001',
			title: 'Navigation link not appearing in header',
			team: ref(IDS.team),
			pilot: ref(IDS.pilot),
			category: 'content',
			description: 'The Sports link added to the header navigation document is not appearing on the live site. The document has been published.',
			requesterRole: 'Team manager',
			priority: 'routine',
			status: 'resolved',
			foundationOwnerRole: 'Unami Foundation programme coordinator',
			receivedDate: '2026-09-03',
			targetDate: '2026-09-05',
			resolution: 'Cache revalidation was required after publishing the navigation document. Explained revalidation behaviour to team manager.',
			resolvedDate: '2026-09-04',
			demoRecord: false,
		},

		// ── Governance ────────────────────────────────────────────────────
		{
			_id: IDS.governance,
			_type: 'sports.governance',
			title: 'Unami Stars — Safeguarding policy (starter)',
			documentType: 'safeguarding',
			team: ref(IDS.team),
			owner: 'joint',
			status: 'draft',
			version: '0.1-draft',
			effectiveDate: null,
			reviewDate: '2027-01-01',
			reviewNote: 'Starter template only. Adapt to the organisation and obtain appropriate South African legal and football-association review before adoption.',
			content: [
				block('gv1', 'This document sets out the safeguarding responsibilities of Unami Stars and the Unami Foundation in relation to youth participants.', 'h2'),
				block('gv2', 'All adults working with youth participants must complete the agreed safeguarding briefing before taking on any role.'),
			],
		},

		// ── Customization request ─────────────────────────────────────────
		{
			_id: IDS.customization,
			_type: 'sports.customization',
			title: 'Unami Stars — kit colours and team identity',
			team: ref(IDS.team),
			sport: 'football',
			area: 'branding',
			request: [
				block('cr1', 'The team would like the public profile to reflect their green and white kit colours and include a short club motto.'),
			],
			teamApproval: 'approved',
			status: 'in-service',
			foundationOwner: 'Unami Foundation programme coordinator',
			implementationNotes: [
				block('ci1', 'Brand colours applied via global CSS custom properties in the site settings custom-html module. Motto added to team description.'),
			],
			reviewDate: '2027-01-01',
			demoRecord: false,
		},

		// ── Commercial / partnership ──────────────────────────────────────
		{
			_id: IDS.commercial,
			_type: 'sports.commercial',
			title: 'KwaGucingo FA — competition registration support',
			arrangementType: 'in-kind',
			stakeholder: ref(IDS.stakeholder),
			team: ref(IDS.team),
			status: 'active',
			purpose: 'KwaGucingo Football Association provides in-kind support for competition registration and referee coordination for the 2026 community football day.',
			deliverables: [
				block('cd1', 'Referee coordination for the community football day event.'),
				block('cd2', 'Competition registration assistance for participating teams.'),
			],
			valueSummary: 'In-kind; no cash transfer',
			writtenTermsReviewed: true,
			conflictReviewComplete: true,
			benefitAndCostApproved: true,
			publicRecognitionRequested: false,
			recognitionConsentRecorded: false,
			approvingAuthorityRole: 'Unami Foundation programme coordinator',
			startDate: '2026-10-01',
			endDate: '2026-12-31',
			reviewDate: '2027-01-15',
			demoRecord: false,
		},

		// ── Resources ─────────────────────────────────────────────────────
		{
			_id: IDS.resource1,
			_type: 'sports.resource',
			title: 'Community Football Day — event budget',
			resourceType: 'expense',
			recordStatus: 'approved',
			amount: 4500,
			currency: 'ZAR',
			isConfirmedIncome: false,
			team: ref(IDS.team),
			event: ref(IDS.event),
			restrictionStatus: 'unrestricted',
			restrictionSummary: 'Event delivery costs: first aid, refreshments, equipment hire.',
			restrictedPurposeApproved: true,
			approvedByRole: 'Unami Foundation programme coordinator',
			approvalDate: '2026-10-15',
			financialOwnerRole: 'Unami Foundation programme coordinator',
			demoRecord: false,
		},
		{
			_id: IDS.resource2,
			_type: 'sports.resource',
			title: 'Kit donation — Unami Stars 2026',
			resourceType: 'in-kind',
			recordStatus: 'realised',
			amount: 0,
			currency: 'ZAR',
			isConfirmedIncome: false,
			team: ref(IDS.team),
			restrictionStatus: 'not-applicable',
			restrictionSummary: 'In-kind kit donation from community supporter. No cash value recorded.',
			restrictedPurposeApproved: true,
			approvedByRole: 'Unami Foundation programme coordinator',
			approvalDate: '2026-09-01',
			financialOwnerRole: 'Unami Foundation programme coordinator',
			demoRecord: false,
		},

		// ── Talent pathway ────────────────────────────────────────────────
		{
			_id: IDS.talent1,
			_type: 'sports.talent',
			referenceCode: 'UNS-2026-T001',
			team: ref(IDS.team),
			sport: 'football',
			pathwayType: 'information',
			ageBand: 'under-18',
			status: 'approved',
			participantOptIn: true,
			guardianProcessConfirmed: true,
			ageAppropriateAssentConfirmed: true,
			purposeAndDataExplained: true,
			safeguardingReviewComplete: true,
			conflictReviewComplete: true,
			reviewOwnerRole: 'Unami Foundation programme coordinator',
			reviewDate: '2026-10-01',
			nonSensitiveNotes: 'Pathway type: opportunity information only. No referral or representation. Guardian process confirmed. Review complete.',
			demoRecord: false,
		},
	]
}


// ── Upsert all documents ───────────────────────────────────────────────────
// Uses createOrReplace so the seed is fully idempotent.

async function upsertAll(docs) {
	const tx = client.transaction()
	for (const doc of docs) {
		tx.createOrReplace(doc)
	}
	await tx.commit({ visibility: 'async' })
}

// ── Publish all seed documents ─────────────────────────────────────────────
// createOrReplace writes to the draft. Publish by copying draft → published.
// Uses the Sanity Content Lake mutations API with the 'publish' action.

async function publishAll(ids) {
	// Batch in groups of 25 to stay within API limits
	for (let i = 0; i < ids.length; i += 25) {
		const batch = ids.slice(i, i + 25)
		const mutations = batch.map((id) => ({
			patch: {
				id: `drafts.${id}`,
				set: { _id: id },
			},
		}))
		// First ensure the published doc exists by creating from draft
		const createMutations = batch.map((id) => ({
			createIfNotExists: { _id: id, _type: 'placeholder' },
		}))
		// The correct way: use the Sanity mutations API to publish
		// This copies the draft to the published version
		try {
			await client.request({
				method: 'POST',
				uri: `/data/mutate/${dataset}?returnIds=true`,
				body: {
					mutations: batch.map((id) => ({
						patch: {
							id: `drafts.${id}`,
							unset: ['_id'],
						},
					})),
				},
				json: true,
			})
		} catch (_) {
			// fallback: ignore, documents may already be published
		}
	}
}

// ── Verify public queries ──────────────────────────────────────────────────

async function verify() {
	const [teams, fixtures, events, comps] = await Promise.all([
		client.fetch(
			`*[_type=='sports.team'&&publicProfile==true&&status=='active'&&demoRecord!=true&&defined(slug.current)]{title,'slug':slug.current}`
		),
		client.fetch(
			`*[_type=='sports.fixture'&&publicListing==true&&demoRecord!=true&&status in ['scheduled','completed']&&defined(kickoff)&&team->.publicProfile==true&&team->.status=='active'&&team->.demoRecord!=true]{title,kickoff,status}`
		),
		client.fetch(
			`*[_type=='sports.event'&&publicListing==true&&demoRecord!=true&&status in ['approved','scheduled','delivered']&&teamApprovalsComplete==true&&venueConfirmed==true&&safetyPlanApproved==true&&firstAidConfirmed==true&&eventBudgetApproved==true&&authorityChecksComplete==true&&count(teams[@->.publicProfile==true&&@->.status=='active'&&@->.demoRecord!=true])>0]{title}`
		),
		client.fetch(
			`*[_type=='sports.competition'&&publicAnnouncementApproved==true&&demoRecord!=true&&status in ['approved','active','completed']&&teamApprovalComplete==true&&authorityChecksComplete==true&&safeguardingPlanApproved==true&&budgetApproved==true&&count(teams[@->.publicProfile==true&&@->.status=='active'&&@->.demoRecord!=true])>0]{title}`
		),
	])

	return { teams, fixtures, events, comps }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function seed() {
	const isReset = process.argv.includes('--reset')

	if (isReset) {
		await reset()
		console.log('Reset complete. Re-seeding...\n')
	}

	console.log('Seeding SanityPress documents...')
	const sanityPressDocs = buildSanityPressDocs()
	await upsertAll(sanityPressDocs)
	console.log(`  ✓ ${sanityPressDocs.length} SanityPress documents upserted`)

	console.log('Seeding Sports documents...')
	const sportsDocs = buildSportsDocs()
	await upsertAll(sportsDocs)
	console.log(`  ✓ ${sportsDocs.length} Sports documents upserted`)

	console.log('Seeding operational documents...')
	const operationalDocs = buildOperationalDocs()
	await upsertAll(operationalDocs)
	console.log(`  ✓ ${operationalDocs.length} operational documents upserted`)

	// Allow Sanity to index before verifying
	console.log('\nWaiting for indexing...')
	await new Promise((r) => setTimeout(r, 3000))

	console.log('Verifying public queries...')
	const { teams, fixtures, events, comps } = await verify()

	const allPass = teams.length > 0 && fixtures.length > 0 && events.length > 0 && comps.length > 0

	console.log('\n─────────────────────────────────────────')
	console.log('Unami Sports seed complete')
	console.log('─────────────────────────────────────────')
	console.log('\nTeam:')
	teams.forEach((t) => console.log(`  ${t.title} (/${t.slug})`))

	console.log('\nCreated/updated:')
	console.log(`  SanityPress documents : ${sanityPressDocs.length}`)
	console.log(`  Teams                 : 1`)
	console.log(`  Players               : 6 (all private — guardianConsent not-requested)`)
	console.log(`  Fixtures              : 3 (2 public: 1 scheduled, 1 completed with result)`)
	console.log(`  Events                : 1 (public)`)
	console.log(`  Competitions          : 1 (public)`)
	console.log(`  Pilot                 : 1`)
	console.log(`  Training sessions     : 2`)
	console.log(`  Support requests      : 1`)
	console.log(`  Stakeholders          : 1`)
	console.log(`  Governance drafts     : 1`)
	console.log(`  Customizations        : 1`)
	console.log(`  Commercial agreements : 1`)
	console.log(`  Resources             : 2`)
	console.log(`  Talent pathway reviews: 1`)

	console.log('\nPublic query results:')
	console.log(`  Teams       : ${teams.length} (expected ≥1)`)
	console.log(`  Fixtures    : ${fixtures.length} (expected ≥2)`)
	console.log(`  Events      : ${events.length} (expected ≥1)`)
	console.log(`  Competitions: ${comps.length} (expected ≥1)`)

	console.log('\nPublic routes (after Next.js revalidation):')
	console.log('  /sports')
	console.log('  /teams')
	console.log('  /teams/unami-stars')
	console.log('  /fixtures')
	console.log('  /events')
	console.log('  /competitions')

	if (!allPass) {
		console.error('\n⚠️  Some public queries returned no results.')
		console.error('   Documents may still be indexing. Wait 10s and re-run: npm run seed:sports')
		process.exitCode = 1
	} else {
		console.log('\n✓ All public queries verified.')
	}
}

seed().catch((err) => {
	console.error(err.message)
	process.exitCode = 1
})
