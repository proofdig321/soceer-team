import { groq } from 'next-sanity'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'

// ── Types ──────────────────────────────────────────────────────────────────

export type OpsStakeholder = {
	_id: string
	organization: string
	organizationType: string | null
	relationshipLead: string | null
	supportAreas: string[] | null
	relationshipSummary: string | null
	publicAcknowledgement: boolean
	publicAcknowledgementText: string | null
}

export type OpsCommercial = {
	_id: string
	title: string
	arrangementType: string
	status: string
	purpose: string | null
	valueSummary: string | null
	startDate: string | null
	endDate: string | null
	stakeholderName: string | null
	teamTitle: string | null
}

export type OpsPilot = {
	_id: string
	title: string
	stage: string
	cohort: string | null
	servicesAgreed: string[] | null
	participationApproved: boolean
	supportScopeAgreed: boolean
	safeguardingPlanAgreed: boolean
	accessRolesTested: boolean
	primaryEditorTrained: boolean
	backupEditorTrained: boolean
	startDate: string | null
	reviewDate: string | null
	teamTitle: string | null
}

export type OpsGovernance = {
	_id: string
	title: string
	documentType: string
	status: string
	owner: string
	version: string | null
	reviewDate: string | null
	reviewNote: string | null
	teamTitle: string | null
}

export type OpsResource = {
	_id: string
	title: string
	resourceType: string
	recordStatus: string
	amount: number
	currency: string
	restrictionStatus: string | null
	restrictionSummary: string | null
	teamTitle: string | null
}

export type OpsTraining = {
	_id: string
	title: string
	topic: string
	deliveryMode: string | null
	sessionDate: string | null
	participantCount: number | null
	followupStatus: string | null
	outcomes: string | null
	teamTitle: string | null
}

export type OpsSupport = {
	_id: string
	reference: string | null
	title: string
	category: string
	priority: string
	status: string
	description: string | null
	resolution: string | null
	receivedDate: string | null
	resolvedDate: string | null
	teamTitle: string | null
}

export type OpsCustomization = {
	_id: string
	title: string
	area: string
	status: string
	teamApproval: string | null
	implementationNotes: string | null
	reviewDate: string | null
	teamTitle: string | null
}

export type OpsPlayer = {
	_id: string
	displayName: string
	position: string | null
	squad: string | null
	shirtNumber: number | null
	publicProfile: boolean
	guardianConsent: string
	demoRecord: boolean
	teamTitle: string | null
}

// ── Queries ────────────────────────────────────────────────────────────────

const STAKEHOLDERS_QUERY = groq`
	*[_type == 'sports.stakeholder'] | order(organization asc) {
		_id, organization, organizationType, relationshipLead,
		supportAreas, publicAcknowledgement, publicAcknowledgementText,
		'relationshipSummary': pt::text(relationshipSummary)
	}
`

const COMMERCIAL_QUERY = groq`
	*[_type == 'sports.commercial'] | order(status asc, title asc) {
		_id, title, arrangementType, status, purpose, valueSummary,
		startDate, endDate,
		'stakeholderName': stakeholder->organization,
		'teamTitle': team->title
	}
`

const PILOT_QUERY = groq`
	*[_type == 'sports.pilot'] | order(startDate desc) {
		_id, title, stage, cohort, servicesAgreed,
		participationApproved, supportScopeAgreed, safeguardingPlanAgreed,
		accessRolesTested, primaryEditorTrained, backupEditorTrained,
		startDate, reviewDate,
		'teamTitle': team->title
	}
`

const GOVERNANCE_QUERY = groq`
	*[_type == 'sports.governance'] | order(documentType asc) {
		_id, title, documentType, status, owner, version, reviewDate, reviewNote,
		'teamTitle': team->title
	}
`

const RESOURCES_QUERY = groq`
	*[_type == 'sports.resource'] | order(recordStatus asc, title asc) {
		_id, title, resourceType, recordStatus, amount, currency,
		restrictionStatus, restrictionSummary,
		'teamTitle': team->title
	}
`

const TRAINING_QUERY = groq`
	*[_type == 'sports.training'] | order(sessionDate desc) {
		_id, title, topic, deliveryMode, sessionDate, participantCount,
		followupStatus,
		'outcomes': pt::text(outcomes),
		'teamTitle': team->title
	}
`

const SUPPORT_QUERY = groq`
	*[_type == 'sports.support'] | order(receivedDate desc) {
		_id, reference, title, category, priority, status,
		description, resolution, receivedDate, resolvedDate,
		'teamTitle': team->title
	}
`

const CUSTOMIZATION_QUERY = groq`
	*[_type == 'sports.customization'] | order(status asc, title asc) {
		_id, title, area, status, teamApproval, reviewDate,
		'implementationNotes': pt::text(implementationNotes),
		'teamTitle': team->title
	}
`

const PLAYERS_QUERY = groq`
	*[_type == 'sports.player'] | order(shirtNumber asc) {
		_id, displayName, position, squad, shirtNumber,
		publicProfile, guardianConsent, demoRecord,
		'teamTitle': team->title
	}
`

// ── Fetchers — use client with token (operational data requires auth) ──────

async function fetchOps<T>(query: string): Promise<T[]> {
	'use cache'
	const data = await client
		.withConfig({ token, useCdn: false, perspective: 'published' })
		.fetch(query)
	return data as T[]
}

export const getOpsStakeholders = () => fetchOps<OpsStakeholder>(STAKEHOLDERS_QUERY)
export const getOpsCommercial   = () => fetchOps<OpsCommercial>(COMMERCIAL_QUERY)
export const getOpsPilots       = () => fetchOps<OpsPilot>(PILOT_QUERY)
export const getOpsGovernance   = () => fetchOps<OpsGovernance>(GOVERNANCE_QUERY)
export const getOpsResources    = () => fetchOps<OpsResource>(RESOURCES_QUERY)
export const getOpsTraining     = () => fetchOps<OpsTraining>(TRAINING_QUERY)
export const getOpsSupport      = () => fetchOps<OpsSupport>(SUPPORT_QUERY)
export const getOpsCustomization = () => fetchOps<OpsCustomization>(CUSTOMIZATION_QUERY)
export const getOpsPlayers      = () => fetchOps<OpsPlayer>(PLAYERS_QUERY)
