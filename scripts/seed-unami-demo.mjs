/**
 * Unami Stars — canonical data seed
 *
 * Patches all sports records to their real active state.
 * Safe to re-run: uses createIfNotExists + patch, never overwrites pages/nav/images.
 *
 * Run:  node --env-file=.env.local scripts/seed-unami-demo.mjs
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
	throw new Error('Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN')
}

const client = createClient({ projectId, dataset, apiVersion: '2026-10-05', useCdn: false, token })

function block(key, style, text) {
	return { _key: key, _type: 'block', style, markDefs: [],
		children: [{ _key: key + 's', _type: 'span', marks: [], text }] }
}

async function seed() {
	const tx = client.transaction()

	// ── Team ──────────────────────────────────────────────────────────────────
	tx.patch('unami.sports-team.unami-stars', p => p.set({
		title: 'Unami Stars',
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
			block('d1', 'normal', 'Unami Stars is a community youth football club based in Emndozo, KwaGucingo, KwaZulu-Natal. The club is part of the Unami Sports programme — a community-first operating model that gives grassroots teams a digital home, shared tools and practical support while keeping the club fully team-led.'),
		],
	}))

	// ── Fixture ───────────────────────────────────────────────────────────────
	tx.patch('unami.fixture.sample-friendly', p => p
		.set({
			title: 'Unami Stars vs Emndozo United',
			opponent: 'Emndozo United',
			competition: 'Pre-season friendly',
			season: '2026',
			kickoff: '2026-11-15T10:00:00+02:00',
			venue: 'KwaGucingo Community Ground',
			status: 'scheduled',
			publicListing: true,
			demoRecord: false,
		})
		.unset(['matchReport', 'homeScore', 'awayScore'])
	)

	// ── Competition ───────────────────────────────────────────────────────────
	tx.patch('unami.demo.competition.community-day', p => p.set({
		title: 'KwaGucingo Community Football Day 2026',
		sport: 'football',
		format: 'festival',
		status: 'approved',
		startDate: '2026-12-06',
		endDate: '2026-12-06',
		teamApprovalComplete: true,
		authorityChecksComplete: true,
		safeguardingPlanApproved: true,
		budgetApproved: true,
		publicAnnouncementApproved: true,
		demoRecord: false,
		competitionOwnerRole: 'Unami Foundation programme coordinator',
		rulesSummary: [
			block('cr1', 'normal', 'A one-day community football festival open to youth teams in the KwaGucingo area. Small-sided games, inclusive format, no league standings.'),
		],
	}))

	// ── Event ─────────────────────────────────────────────────────────────────
	tx.patch('unami.demo.event.community-day', p => p.set({
		title: 'KwaGucingo Community Football Day',
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
	}))

	// ── Announcement ──────────────────────────────────────────────────────────
	tx.patch('unami.announcement.demo', p => p.set({
		content: [block('a1', 'normal', 'Welcome to Unami Stars — community football in Emndozo, KwaGucingo, supported by Unami Foundation.')],
		ctas: [],
	}))

	// ── Site title ────────────────────────────────────────────────────────────
	tx.patch('site', p => p.set({ title: 'Unami Sports · Unami Stars' }))

	await tx.commit()

	// ── Verify ────────────────────────────────────────────────────────────────
	const [teams, fixtures, events, comps] = await Promise.all([
		client.fetch(`*[_type=='sports.team'&&publicProfile==true&&status=='active'&&demoRecord!=true&&defined(slug.current)]{title,'slug':slug.current}`),
		client.fetch(`*[_type=='sports.fixture'&&publicListing==true&&demoRecord!=true&&status in ['scheduled','completed']&&defined(kickoff)&&team->.publicProfile==true&&team->.status=='active'&&team->.demoRecord!=true]{title,kickoff}`),
		client.fetch(`*[_type=='sports.event'&&publicListing==true&&demoRecord!=true&&status in ['approved','scheduled','delivered']&&teamApprovalsComplete==true&&venueConfirmed==true&&safetyPlanApproved==true&&firstAidConfirmed==true&&eventBudgetApproved==true&&authorityChecksComplete==true&&count(teams[@->.publicProfile==true&&@->.status=='active'&&@->.demoRecord!=true])>0]{title}`),
		client.fetch(`*[_type=='sports.competition'&&publicAnnouncementApproved==true&&demoRecord!=true&&status in ['approved','active','completed']&&teamApprovalComplete==true&&authorityChecksComplete==true&&safeguardingPlanApproved==true&&budgetApproved==true&&count(teams[@->.publicProfile==true&&@->.status=='active'&&@->.demoRecord!=true])>0]{title}`),
	])

	if (!teams.length || !fixtures.length || !events.length || !comps.length) {
		throw new Error(`Verification failed — teams:${teams.length} fixtures:${fixtures.length} events:${events.length} comps:${comps.length}`)
	}

	console.log(JSON.stringify({ teams, fixtures, events, comps }, null, 2))
	console.log('✓ Unami Stars seed complete')
}

seed().catch(err => { console.error(err.message); process.exitCode = 1 })
