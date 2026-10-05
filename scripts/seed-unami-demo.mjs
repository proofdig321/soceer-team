import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
	throw new Error(
		'Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN before seeding.',
	)
}

const client = createClient({
	projectId,
	dataset,
	apiVersion: '2026-10-05',
	useCdn: false,
	token,
	perspective: 'published',
})

const teamId = 'unami.sports-team.unami-stars'
const pilotId = 'unami.demo.pilot.stars'
const competitionId = 'unami.demo.competition.community-day'
const eventId = 'unami.demo.event.community-day'
const resourceId = 'unami.demo.resource.platform-support'
const stakeholderId = 'unami.stakeholder.unami-foundation'

function block(key, style, text) {
	return {
		_key: key,
		_type: 'block',
		style,
		markDefs: [],
		children: [{ _key: `${key}-span`, _type: 'span', marks: [], text }],
	}
}

function card(key, eyebrow, heading, text) {
	return {
		_key: key,
		_type: 'card',
		eyebrow,
		content: [
			block(`${key}-heading`, 'h3', heading),
			block(`${key}-body`, 'normal', text),
		],
	}
}

function reference(id) {
	return { _type: 'reference', _ref: id }
}

const documents = [
	{
		_id: pilotId,
		_type: 'sports.pilot',
		title: 'DEMO ONLY — Unami Stars proposed first team pilot',
		team: reference(teamId),
		cohort: 'Illustrative first-pilot prototype; not an active partnership',
		stage: 'discovery',
		teamRepresentativeRole: 'Prospective team representative — to be confirmed',
		foundationOwnerRole: 'Unami Sports programme owner — to be appointed',
		need: [
			block(
				'pilot-purpose',
				'normal',
				'Demonstration planning record only. Validate the team’s needs, authority to participate, safeguarding arrangements, service scope, access model and funding with real authorised people before activating a pilot.',
			),
		],
		servicesAgreed: [],
		participationApproved: false,
		supportScopeAgreed: false,
		safeguardingPlanAgreed: false,
		accessRolesTested: false,
		primaryEditorTrained: false,
		backupEditorTrained: false,
		demoRecord: true,
	},
	{
		_id: 'unami.demo.training.team-admin',
		_type: 'sports.training',
		title: 'DEMO PLAN — Team administrator onboarding (not delivered)',
		team: reference(teamId),
		pilot: reference(pilotId),
		topic: 'administration',
		deliveryMode: 'self-guided',
		facilitatorRole: 'Unami Sports facilitator — to be appointed',
		materials: [
			'Team authority and decision rights',
			'Safe page editing and preview',
			'Publishing and correction process',
			'Account access and handover checklist',
		],
		outcomes: [
			block(
				'training-outcome',
				'normal',
				'Planned learning outcomes only; no training session has taken place. A real onboarding should train two team-nominated adult editors, practise a content correction, and verify their access independently.',
			),
		],
		followupOwnerRole:
			'Team administrators and Unami Sports programme owner — to be appointed',
		followupStatus: 'open',
		demoRecord: true,
	},
	{
		_id: 'unami.demo.support.publishing',
		_type: 'sports.support',
		reference: 'DEMO-SUPPORT-001',
		title: 'DEMO ONLY — Example routine publishing support request',
		team: reference(teamId),
		pilot: reference(pilotId),
		category: 'publishing',
		description:
			'Training example only; no team has submitted this request and no work is outstanding. Illustrates how an authorised adult editor could ask for help previewing or correcting approved public content. Never use this queue for safeguarding concerns, emergencies, passwords or sensitive personal information.',
		requesterRole: 'Illustrative team editor — not a real requester',
		priority: 'routine',
		status: 'new',
		foundationOwnerRole: 'Unami Sports support owner — to be appointed',
		demoRecord: true,
	},
	{
		_id: competitionId,
		_type: 'sports.competition',
		title: 'DEMO PROPOSAL — KwaGucingo community football festival',
		sport: 'football',
		format: 'festival',
		status: 'concept',
		teams: [reference(teamId)],
		rulesSummary: [
			block(
				'competition-concept',
				'normal',
				'Illustrative concept only. No participating teams have been invited or confirmed. Explore a small, inclusive community football day before considering a recurring league. Confirm team demand, association requirements, officials, venue, transport, safety, safeguarding, first aid, insurance, budget and cancellation responsibilities before approval or announcement.',
			),
		],
		competitionOwnerRole:
			'Community competition convenor — to be appointed after feasibility review',
		teamApprovalComplete: false,
		authorityChecksComplete: false,
		safeguardingPlanApproved: false,
		budgetApproved: false,
		financialResources: [reference(resourceId)],
		publicAnnouncementApproved: false,
		demoRecord: true,
	},
	{
		_id: eventId,
		_type: 'sports.event',
		title: 'DEMO PROPOSAL — Community football festival (not scheduled)',
		competition: reference(competitionId),
		teams: [reference(teamId)],
		status: 'proposed',
		eventLeadRole: 'Community event lead — to be appointed',
		venueConfirmed: false,
		teamApprovalsComplete: false,
		authorityChecksComplete: false,
		safetyPlanApproved: false,
		firstAidConfirmed: false,
		transportPlanApproved: false,
		budget: reference(resourceId),
		eventBudgetApproved: false,
		cancellationPlan:
			'No date or venue is selected. Do not publish or invite participants until participating teams, venue, weather/cancellation process, safety plan, first aid, transport, authority checks and approved funding are confirmed.',
		publicListing: false,
		actualCostReviewComplete: false,
		demoRecord: true,
	},
	{
		_id: resourceId,
		_type: 'sports.resource',
		title: 'DEMO FORECAST — Donated platform and onboarding capacity',
		resourceType: 'in-kind',
		recordStatus: 'forecast',
		currency: 'ZAR',
		isConfirmedIncome: false,
		sourceStakeholder: reference(stakeholderId),
		team: reference(teamId),
		event: reference(eventId),
		restrictionStatus: 'not-applicable',
		restrictionSummary:
			'Illustrative planning assumption describing the proposed donated platform, setup, adult administrator training, routine maintenance and support. No monetary value, budget approval, staff capacity or funding commitment is represented as confirmed.',
		restrictedPurposeApproved: false,
		financialOwnerRole: 'Unami Foundation finance role — to be appointed',
		demoRecord: true,
	},
	{
		_id: 'unami.demo.commercial.sponsorship-framework',
		_type: 'sports.commercial',
		title: 'DEMO CONCEPT — Responsible community sport sponsorship framework',
		arrangementType: 'sponsorship',
		stakeholder: reference(stakeholderId),
		team: reference(teamId),
		status: 'exploratory',
		purpose:
			'Illustrate how the Foundation could assess aligned support for grassroots sport without implying that a sponsor exists or has committed. Any real arrangement requires written terms, conflict review, approved costs/benefits, transparent allocation and safeguarding review.',
		deliverables: [
			block(
				'commercial-boundary',
				'normal',
				'Any recognition must be proportionate and consented. Sponsorship cannot buy access to children, influence team selection, collect participant data, control editorial decisions or imply endorsement by a team or community without explicit approval.',
			),
		],
		valueSummary:
			'Illustrative framework only — no sponsor, amount, benefit or commitment confirmed',
		writtenTermsReviewed: false,
		conflictReviewComplete: false,
		benefitAndCostApproved: false,
		publicRecognitionRequested: false,
		recognitionConsentRecorded: false,
		demoRecord: true,
	},
]

const operatorOverview = {
	_key: 'unami-demo-operator-overview',
	_type: 'card-list',
	eyebrow: 'THE PILOT, IN PRACTICE',
	intro: [
		block(
			'operator-overview-heading',
			'h2',
			'A community sports operating partner—not a club takeover.',
		),
		block(
			'operator-overview-intro',
			'normal',
			'Unami Stars is the illustrative first-team prototype for Unami Sports. This demo shows a proposed operating model; it is not evidence of an active partnership, registered team, confirmed funding, scheduled match or enrolled youth squad.',
		),
	],
	layout: 'grid',
	columns: 3,
	cards: [
		card(
			'operator-team',
			'TEAM-LED',
			'The team owns its affairs',
			'The participating team decides its sporting priorities, identity, local coordination, volunteer roles and approved public story. Unami Foundation does not select players or govern the club.',
		),
		card(
			'operator-foundation',
			'FOUNDATION-ENABLED',
			'Unami Sports sustains the tools',
			'The proposed operating-partner offer is donated digital infrastructure, setup, adult-editor training, maintenance, routine support and stakeholder coordination—within an agreed, resourced service scope.',
		),
		card(
			'operator-gate',
			'PILOT STATUS',
			'Prototype assembled; pilot not activated',
			'A real start requires team-authorised participation, agreed responsibilities and exit terms, safeguarding arrangements, a data plan, trained team editors and tested least-privilege access.',
		),
		card(
			'operator-growth',
			'GROWTH PATH',
			'Pilot, learn, then convene',
			'Start with one team; invite other teams only after learning; test a small tournament only after demand, association checks, safeguarding, venue, transport, officials and budget are ready. A league is a later decision, not a promise.',
		),
		card(
			'operator-sustainability',
			'SUSTAINABILITY',
			'Earn trust before income',
			'Explore grants, donations, responsible sponsorship, in-kind support and mission-aligned earned services. Record restrictions, conflicts, costs and cross-subsidy transparently. No funding or commercial partner is represented as secured.',
		),
		card(
			'operator-template',
			'REUSABLE BY DESIGN',
			'Football first; adaptable by sport',
			'The operating pattern can be adapted for rugby, basketball, tennis, netball or athletics after co-design. Each team keeps its own identity and decisions; shared tools and support are stewarded separately.',
		),
	],
}

const pilotLaunchGates = {
	_key: 'unami-demo-pilot-launch-gates',
	_type: 'step-list',
	eyebrow: 'BEFORE A REAL TEAM GOES LIVE',
	intro: [
		block(
			'launch-gates-heading',
			'h2',
			'A responsible pilot has gates—not just a website.',
		),
		block(
			'launch-gates-intro',
			'normal',
			'The demo is ready to discuss. A real pilot moves forward only when the team and Foundation agree each step, name accountable roles and can sustain the work.',
		),
	],
	enableSchema: false,
	steps: [
		{
			_key: 'launch-gate-1',
			_type: 'step',
			content: [
				block('launch-gate-1-title', 'h3', 'Confirm the partner and purpose'),
				block(
					'launch-gate-1-copy',
					'normal',
					'A team-authorised conversation confirms the need, decision rights, who may represent the team and what success should look like. No assumed participation.',
				),
			],
		},
		{
			_key: 'launch-gate-2',
			_type: 'step',
			content: [
				block(
					'launch-gate-2-title',
					'h3',
					'Agree the service and sustainability',
				),
				block(
					'launch-gate-2-copy',
					'normal',
					'Define donated and funded services, response expectations, ongoing costs, commercial boundaries, renewal and a fair exit/export plan before onboarding.',
				),
			],
		},
		{
			_key: 'launch-gate-3',
			_type: 'step',
			content: [
				block('launch-gate-3-title', 'h3', 'Make youth participation safe'),
				block(
					'launch-gate-3-copy',
					'normal',
					'Adopt locally reviewed safeguarding and image-consent processes; minimise personal data; keep sensitive case details out of the public website and general CMS workflows.',
				),
			],
		},
		{
			_key: 'launch-gate-4',
			_type: 'step',
			content: [
				block(
					'launch-gate-4-title',
					'h3',
					'Train people and test real permissions',
				),
				block(
					'launch-gate-4-copy',
					'normal',
					'Train two nominated adult editors where possible, practise publishing and correction, and independently test actual Foundation/team access roles. CMS ownership labels are not security controls.',
				),
			],
		},
		{
			_key: 'launch-gate-5',
			_type: 'step',
			content: [
				block('launch-gate-5-title', 'h3', 'Review evidence before expanding'),
				block(
					'launch-gate-5-copy',
					'normal',
					'Review adoption, support load, inclusion, safety, costs and team feedback. Only then consider another team, a one-off event or—much later—a sustainable development league.',
				),
			],
		},
	],
}

async function seed() {
	const transaction = client.transaction()
	for (const document of documents) {
		transaction.createIfNotExists(document)
	}
	const result = await transaction.commit()

	const home = await client.fetch(
		'*[_id == "unami.page.home"][0]{_rev, "keys": modules[]._key}',
	)
	if (!home) {
		throw new Error('Could not find the Unami Stars homepage document.')
	}

	const moduleKeys = [operatorOverview._key, pilotLaunchGates._key]
	const needsHomepageUpdate = moduleKeys.some(
		(key) => !home.keys?.includes(key),
	)

	if (needsHomepageUpdate) {
		const missingModules = [operatorOverview, pilotLaunchGates].filter(
			(module) => !home.keys?.includes(module._key),
		)
		await client
			.patch('unami.page.home')
			.ifRevisionId(home._rev)
			.insert('before', 'modules[3]', missingModules)
			.commit()
	}

	const verification = await client.fetch(
		`{"home": *[_id == "unami.page.home"][0]{title, "moduleCount": count(modules), "moduleTypes": modules[]._type, "newKeys": modules[_key in ["unami-demo-operator-overview", "unami-demo-pilot-launch-gates"]]._key}, "demoRecords": *[_id in ${JSON.stringify(documents.map(({ _id }) => _id))}]{_id, _type, title, demoRecord, stage, status, recordStatus, publicListing}}`,
	)
	console.log(
		JSON.stringify({
			documentCreatesAttempted: result.results?.length ?? documents.length,
			homepageUpdated: needsHomepageUpdate,
			verification,
		}),
	)
}

seed().catch((error) => {
	console.error(`Unami demo seed failed: ${error.message}`)
	process.exitCode = 1
})
