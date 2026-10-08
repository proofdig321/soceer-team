/**
 * seed-sports-v2.mjs — correct field names, full demo data
 */
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: '4e4wulgj',
	dataset: 'production',
	apiVersion: '2024-01-01',
	useCdn: false,
	token: process.env.SANITY_API_WRITE_TOKEN,
})

const ref = (id) => ({ _type: 'reference', _ref: id })
const b = (text, style = 'normal') => ({
	_type: 'block', _key: Math.random().toString(36).slice(2, 8),
	style, markDefs: [],
	children: [{ _type: 'span', _key: 'sp', text, marks: [] }],
})

const TEAM_ID = 'seed.sports.team.unami-stars'
const COMP_ID = 'seed.sports.competition.kwagucingo-league'

const docs = [

	// ── TEAM ──────────────────────────────────────────────────────────────────
	{
		_id: TEAM_ID,
		_type: 'sports.team',
		title: 'Unami Stars FC',
		slug: { _type: 'slug', current: 'unami-stars' },
		sport: 'football',
		season: '2026',
		ageGroup: 'U19',
		community: 'Kwagucingo',
		province: 'KwaZulu-Natal',
		status: 'active',
		publicProfile: true,
		demoRecord: true,
		operationalOwner: 'team',
		description: [
			b('Unami Stars FC is a community youth football club based in Kwagucingo, KwaZulu-Natal.'),
			b('The club is part of the Unami Sports programme — a community-first operating model that gives grassroots teams a digital home, shared tools, and practical support while keeping the club fully team-led.'),
		],
	},

	// ── PLAYERS ───────────────────────────────────────────────────────────────
	{
		_id: 'seed.sports.player.p001',
		_type: 'sports.player',
		displayName: 'Sipho Dlamini',
		team: ref(TEAM_ID),
		shirtNumber: 1,
		position: 'Goalkeeper',
		squad: 'U19',
		guardianConsent: 'approved',
		publicProfile: true,
		demoRecord: true,
		operationalOwner: 'team',
		introduction: [b('Commanding goalkeeper. 2 appearances, 1 clean sheet in the 2026 season.')],
	},
	{
		_id: 'seed.sports.player.p002',
		_type: 'sports.player',
		displayName: 'Lungelo Zulu',
		team: ref(TEAM_ID),
		shirtNumber: 2,
		position: 'Right Back',
		squad: 'U19',
		guardianConsent: 'approved',
		publicProfile: true,
		demoRecord: true,
		operationalOwner: 'team',
		introduction: [b('Energetic right back. 2 appearances, 1 assist in the 2026 season.')],
	},
	{
		_id: 'seed.sports.player.p003',
		_type: 'sports.player',
		displayName: 'Thabo Nkosi',
		team: ref(TEAM_ID),
		shirtNumber: 4,
		position: 'Centre Back',
		squad: 'U19',
		guardianConsent: 'approved',
		publicProfile: true,
		demoRecord: true,
		operationalOwner: 'team',
		introduction: [b('Solid centre back. 2 appearances in the 2026 season.')],
	},
	{
		_id: 'seed.sports.player.p004',
		_type: 'sports.player',
		displayName: 'Mpho Sithole',
		team: ref(TEAM_ID),
		shirtNumber: 8,
		position: 'Central Midfield',
		squad: 'U19',
		guardianConsent: 'approved',
		publicProfile: true,
		demoRecord: true,
		operationalOwner: 'team',
		introduction: [b('Creative midfielder. 2 appearances, 1 goal, 1 assist in the 2026 season.')],
	},
	{
		_id: 'seed.sports.player.p005',
		_type: 'sports.player',
		displayName: 'Bongani Mokoena',
		team: ref(TEAM_ID),
		shirtNumber: 9,
		position: 'Striker',
		squad: 'U19',
		guardianConsent: 'approved',
		publicProfile: true,
		demoRecord: true,
		operationalOwner: 'team',
		introduction: [b('Top scorer. 2 appearances, 2 goals in the 2026 season.')],
	},
	{
		_id: 'seed.sports.player.p006',
		_type: 'sports.player',
		displayName: 'Siyanda Khumalo',
		team: ref(TEAM_ID),
		shirtNumber: 11,
		position: 'Left Wing',
		squad: 'U19',
		guardianConsent: 'approved',
		publicProfile: true,
		demoRecord: true,
		operationalOwner: 'team',
		introduction: [b('Pacey winger. 2 appearances, 2 assists in the 2026 season.')],
	},

	// ── COMPETITION ───────────────────────────────────────────────────────────
	{
		_id: COMP_ID,
		_type: 'sports.competition',
		title: 'Kwagucingo Community League',
		sport: 'football',
		format: 'league',
		status: 'active',
		startDate: '2026-10-01',
		endDate: '2026-12-31',
		teams: [ref(TEAM_ID)],
		teamApprovalComplete: true,
		authorityChecksComplete: true,
		safeguardingPlanApproved: true,
		budgetApproved: true,
		publicAnnouncementApproved: true,
		demoRecord: true,
		competitionOwnerRole: 'Kwagucingo FA Programme Coordinator',
		ruleVersion: 'v1.0',
		rulesSummary: [b('Round-robin format. U19. 4 teams. Top 2 advance to knockout final. 3 points for a win, 1 for a draw.')],
	},

	// ── FIXTURES ──────────────────────────────────────────────────────────────
	{
		_id: 'seed.sports.fixture.friendly-oct-result',
		_type: 'sports.fixture',
		title: 'Unami Stars vs Riverside FC',
		team: ref(TEAM_ID),
		opponent: 'Riverside FC',
		competition: 'Kwagucingo Community League',
		season: '2026',
		kickoff: '2026-10-15T14:00:00Z',
		venue: 'Kwagucingo Ground',
		status: 'completed',
		homeScore: 2,
		awayScore: 1,
		publicListing: true,
		demoRecord: true,
		operationalOwner: 'team',
		matchReport: [b('Bongani Mokoena opened the scoring in the 34th minute. Riverside equalised before half time. Mpho Sithole sealed the win with a composed finish in the 67th minute. Attendance approximately 80.')],
	},
	{
		_id: 'seed.sports.fixture.friendly-nov',
		_type: 'sports.fixture',
		title: 'Valley United vs Unami Stars',
		team: ref(TEAM_ID),
		opponent: 'Valley United',
		competition: 'Kwagucingo Community League',
		season: '2026',
		kickoff: '2026-11-08T14:00:00Z',
		venue: 'Valley Ground',
		status: 'completed',
		homeScore: 1,
		awayScore: 1,
		publicListing: true,
		demoRecord: true,
		operationalOwner: 'team',
		matchReport: [b('Bongani Mokoena equalised for Unami Stars in the 55th minute after Valley United took an early lead. A hard-fought draw away from home. Attendance approximately 60.')],
	},
	{
		_id: 'seed.sports.fixture.community-day-match',
		_type: 'sports.fixture',
		title: 'Community Day Match',
		team: ref(TEAM_ID),
		opponent: 'Kwagucingo Select XI',
		competition: 'Kwagucingo Community League',
		season: '2026',
		kickoff: '2026-12-20T14:00:00Z',
		venue: 'Kwagucingo Ground',
		status: 'scheduled',
		publicListing: true,
		demoRecord: true,
		operationalOwner: 'team',
	},

	// ── EVENT ─────────────────────────────────────────────────────────────────
	{
		_id: 'seed.sports.event.community-day-2026',
		_type: 'sports.event',
		title: 'Community Day 2026',
		competition: ref(COMP_ID),
		teams: [ref(TEAM_ID)],
		status: 'scheduled',
		startDateTime: '2026-12-20T10:00:00Z',
		endDateTime: '2026-12-20T17:00:00Z',
		publicVenueName: 'Kwagucingo Ground',
		venueConfirmed: true,
		teamApprovalsComplete: true,
		authorityChecksComplete: true,
		safetyPlanApproved: true,
		firstAidConfirmed: true,
		eventBudgetApproved: true,
		transportPlanApproved: true,
		publicListing: true,
		demoRecord: true,
	},
]

async function run() {
	console.log(`Seeding ${docs.length} sports docs...`)
	const tx = client.transaction()
	docs.forEach((doc) => tx.createOrReplace(doc))
	const result = await tx.commit()
	console.log(`✅ Done — ${result.results.length} docs`)
}

run().catch((e) => { console.error(e.message); process.exit(1) })
