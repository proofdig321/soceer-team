/**
 * Sports operational layer components.
 * Surfaces stakeholders, commercial, pilot, governance, resources,
 * training, support, customization and players — the full commercial
 * and operational layer of the platform demo.
 */

import { SportsCard, SportsCardGrid, SportsEmpty, SportsBadge, SportsMeta, formatSportsDate } from './primitives'
import type {
	OpsStakeholder, OpsCommercial, OpsPilot, OpsGovernance,
	OpsResource, OpsTraining, OpsSupport, OpsCustomization, OpsPlayer,
} from '@/lib/sports-ops'

// ── Label maps ─────────────────────────────────────────────────────────────

const orgTypeLabels: Record<string, string> = {
	school: 'School', community: 'Community org', association: 'Football association',
	government: 'Local government', funder: 'Funder', 'service-partner': 'Service partner', other: 'Other',
}
const relationshipLeadLabels: Record<string, string> = {
	foundation: 'Foundation-led', team: 'Team-led', joint: 'Joint',
}
const arrangementLabels: Record<string, string> = {
	sponsorship: 'Sponsorship', grant: 'Grant', donation: 'Donation',
	service: 'Service / earned income', 'in-kind': 'In-kind support',
	vendor: 'Event vendor', talent: 'Talent-related', other: 'Other',
}
const commercialStatusVariant: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
	active: 'success', approved: 'success', completed: 'muted',
	review: 'warning', draft: 'warning', exploratory: 'default', ended: 'muted',
}
const pilotStageVariant: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
	active: 'success', completed: 'muted', review: 'warning',
	paused: 'warning', exited: 'muted', invited: 'default',
	discovery: 'default', agreement: 'default', readiness: 'default',
}
const govStatusVariant: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
	draft: 'warning', 'in-review': 'warning', adopted: 'success',
	superseded: 'muted', withdrawn: 'muted',
}
const resourceTypeLabels: Record<string, string> = {
	income: 'Income', grant: 'Grant', donation: 'Donation', sponsorship: 'Sponsorship',
	'in-kind': 'In-kind', expense: 'Expense', forecast: 'Forecast',
}
const resourceStatusVariant: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
	approved: 'success', realised: 'success', forecast: 'default',
	draft: 'warning', declined: 'muted',
}
const supportStatusVariant: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
	resolved: 'success', open: 'warning', 'in-progress': 'default', closed: 'muted',
}
const consentLabels: Record<string, string> = {
	'not-requested': 'Consent not requested',
	requested: 'Consent requested',
	granted: 'Consent granted',
	withdrawn: 'Consent withdrawn',
}

// ── Stakeholders ───────────────────────────────────────────────────────────

export function StakeholderCard({ s }: { s: OpsStakeholder }) {
	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{s.organization}</h3>
				{s.publicAcknowledgement
					? <SportsBadge label="Publicly acknowledged" variant="success" />
					: <SportsBadge label="Not yet acknowledged" variant="muted" />
				}
			</div>
			<SportsMeta items={[
				s.organizationType ? orgTypeLabels[s.organizationType] ?? s.organizationType : null,
				s.relationshipLead ? relationshipLeadLabels[s.relationshipLead] ?? s.relationshipLead : null,
			]} />
			{s.supportAreas?.length ? (
				<div className="flex flex-wrap gap-1">
					{s.supportAreas.map((a, i) => <SportsBadge key={i} label={a} variant="muted" />)}
				</div>
			) : null}
			{s.relationshipSummary && <p className="text-sm">{s.relationshipSummary}</p>}
			{s.publicAcknowledgement && s.publicAcknowledgementText && (
				<p className="text-sm italic">"{s.publicAcknowledgementText}"</p>
			)}
		</SportsCard>
	)
}

export function StakeholderList({ stakeholders }: { stakeholders: OpsStakeholder[] }) {
	if (!stakeholders.length) return <SportsEmpty label="stakeholders" />
	return (
		<SportsCardGrid cols={2}>
			{stakeholders.map(s => <StakeholderCard key={s._id} s={s} />)}
		</SportsCardGrid>
	)
}

// ── Commercial ─────────────────────────────────────────────────────────────

export function CommercialCard({ c }: { c: OpsCommercial }) {
	const variant = commercialStatusVariant[c.status] ?? 'default'
	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{c.title}</h3>
				<SportsBadge label={c.status} variant={variant} />
			</div>
			<SportsMeta items={[
				arrangementLabels[c.arrangementType] ?? c.arrangementType,
				c.stakeholderName,
				c.teamTitle,
			]} />
			{c.purpose && <p className="text-sm">{c.purpose}</p>}
			{c.valueSummary && <p className="text-sm font-medium">{c.valueSummary}</p>}
			{(c.startDate || c.endDate) && (
				<SportsMeta items={[
					c.startDate ? `From ${formatSportsDate(c.startDate)}` : null,
					c.endDate ? `to ${formatSportsDate(c.endDate)}` : null,
				]} />
			)}
		</SportsCard>
	)
}

export function CommercialList({ items }: { items: OpsCommercial[] }) {
	if (!items.length) return <SportsEmpty label="commercial agreements" />
	return (
		<SportsCardGrid cols={2}>
			{items.map(c => <CommercialCard key={c._id} c={c} />)}
		</SportsCardGrid>
	)
}

// ── Pilot ──────────────────────────────────────────────────────────────────

function ReadinessCheck({ label, done }: { label: string; done: boolean }) {
	return (
		<li className="flex items-center gap-2 text-sm">
			<span className={done ? 'text-emerald-600' : 'text-foreground/30'} aria-hidden>
				{done ? '✓' : '○'}
			</span>
			<span className={done ? '' : 'text-foreground/50'}>{label}</span>
		</li>
	)
}

export function PilotCard({ p }: { p: OpsPilot }) {
	const variant = pilotStageVariant[p.stage] ?? 'default'
	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{p.title}</h3>
				<SportsBadge label={p.stage.replace('-', ' ')} variant={variant} />
			</div>
			<SportsMeta items={[p.teamTitle, p.cohort, p.startDate ? `Started ${formatSportsDate(p.startDate)}` : null]} />
			{p.servicesAgreed?.length ? (
				<div className="flex flex-wrap gap-1">
					{p.servicesAgreed.map((s, i) => <SportsBadge key={i} label={s} variant="muted" />)}
				</div>
			) : null}
			<ul className="grid gap-1 pt-1">
				<ReadinessCheck label="Participation approved" done={p.participationApproved} />
				<ReadinessCheck label="Support scope agreed" done={p.supportScopeAgreed} />
				<ReadinessCheck label="Safeguarding plan agreed" done={p.safeguardingPlanAgreed} />
				<ReadinessCheck label="Access roles tested" done={p.accessRolesTested} />
				<ReadinessCheck label="Primary editor trained" done={p.primaryEditorTrained} />
				<ReadinessCheck label="Backup editor trained" done={p.backupEditorTrained} />
			</ul>
		</SportsCard>
	)
}

export function PilotList({ pilots }: { pilots: OpsPilot[] }) {
	if (!pilots.length) return <SportsEmpty label="pilot records" />
	return (
		<SportsCardGrid cols={2}>
			{pilots.map(p => <PilotCard key={p._id} p={p} />)}
		</SportsCardGrid>
	)
}

// ── Governance ─────────────────────────────────────────────────────────────

const docTypeLabels: Record<string, string> = {
	constitution: 'Constitution', safeguarding: 'Safeguarding policy',
	finance: 'Finance policy', privacy: 'Privacy policy',
	'meeting-minutes': 'Meeting minutes', other: 'Other',
}

export function GovernanceCard({ g }: { g: OpsGovernance }) {
	const variant = govStatusVariant[g.status] ?? 'default'
	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{g.title}</h3>
				<SportsBadge label={g.status} variant={variant} />
			</div>
			<SportsMeta items={[
				docTypeLabels[g.documentType] ?? g.documentType,
				g.owner ? `Owner: ${g.owner}` : null,
				g.version ? `v${g.version}` : null,
				g.reviewDate ? `Review: ${formatSportsDate(g.reviewDate)}` : null,
			]} />
			{g.reviewNote && <p className="text-sm text-foreground/60 italic">{g.reviewNote}</p>}
		</SportsCard>
	)
}

export function GovernanceList({ items }: { items: OpsGovernance[] }) {
	if (!items.length) return <SportsEmpty label="governance documents" />
	return (
		<SportsCardGrid cols={2}>
			{items.map(g => <GovernanceCard key={g._id} g={g} />)}
		</SportsCardGrid>
	)
}

// ── Resources ──────────────────────────────────────────────────────────────

export function ResourceCard({ r }: { r: OpsResource }) {
	const variant = resourceStatusVariant[r.recordStatus] ?? 'default'
	const amount = r.amount > 0
		? new Intl.NumberFormat('en-ZA', { style: 'currency', currency: r.currency ?? 'ZAR', maximumFractionDigits: 0 }).format(r.amount)
		: r.resourceType === 'in-kind' ? 'In-kind (no cash value)' : null
	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{r.title}</h3>
				<SportsBadge label={r.recordStatus} variant={variant} />
			</div>
			<SportsMeta items={[
				resourceTypeLabels[r.resourceType] ?? r.resourceType,
				r.teamTitle,
				amount,
			]} />
			{r.restrictionSummary && <p className="text-sm">{r.restrictionSummary}</p>}
		</SportsCard>
	)
}

export function ResourceList({ items }: { items: OpsResource[] }) {
	if (!items.length) return <SportsEmpty label="resource records" />
	return (
		<SportsCardGrid cols={2}>
			{items.map(r => <ResourceCard key={r._id} r={r} />)}
		</SportsCardGrid>
	)
}

// ── Training ───────────────────────────────────────────────────────────────

const topicLabels: Record<string, string> = {
	'site-editing': 'Site and page editing', safeguarding: 'Privacy and safeguarding',
	fixtures: 'Fixture management', governance: 'Governance', handover: 'Handover',
}

export function TrainingCard({ t }: { t: OpsTraining }) {
	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{t.title}</h3>
				{t.followupStatus && (
					<SportsBadge
						label={t.followupStatus === 'complete' ? 'Follow-up complete' : t.followupStatus}
						variant={t.followupStatus === 'complete' ? 'success' : 'warning'}
					/>
				)}
			</div>
			<SportsMeta items={[
				topicLabels[t.topic] ?? t.topic,
				t.deliveryMode,
				t.sessionDate ? formatSportsDate(t.sessionDate) : null,
				t.participantCount ? `${t.participantCount} participant${t.participantCount !== 1 ? 's' : ''}` : null,
				t.teamTitle,
			]} />
			{t.outcomes && <p className="text-sm">{t.outcomes}</p>}
		</SportsCard>
	)
}

export function TrainingList({ items }: { items: OpsTraining[] }) {
	if (!items.length) return <SportsEmpty label="training records" />
	return (
		<SportsCardGrid cols={2}>
			{items.map(t => <TrainingCard key={t._id} t={t} />)}
		</SportsCardGrid>
	)
}

// ── Support ────────────────────────────────────────────────────────────────

export function SupportCard({ s }: { s: OpsSupport }) {
	const variant = supportStatusVariant[s.status] ?? 'default'
	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{s.title}</h3>
				<SportsBadge label={s.status} variant={variant} />
			</div>
			<SportsMeta items={[
				s.reference,
				s.category,
				`Priority: ${s.priority}`,
				s.receivedDate ? `Received ${formatSportsDate(s.receivedDate)}` : null,
				s.teamTitle,
			]} />
			{s.description && <p className="text-sm">{s.description}</p>}
			{s.resolution && (
				<p className="text-sm border-l-2 border-emerald-400 pl-3 text-foreground/70">
					<span className="font-medium">Resolution: </span>{s.resolution}
				</p>
			)}
		</SportsCard>
	)
}

export function SupportList({ items }: { items: OpsSupport[] }) {
	if (!items.length) return <SportsEmpty label="support requests" />
	return (
		<SportsCardGrid cols={2}>
			{items.map(s => <SupportCard key={s._id} s={s} />)}
		</SportsCardGrid>
	)
}

// ── Customization ──────────────────────────────────────────────────────────

const customizationStatusVariant: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
	'in-service': 'success', approved: 'success', proposed: 'default',
	'in-progress': 'warning', deferred: 'muted', declined: 'muted',
}
const areaLabels: Record<string, string> = {
	branding: 'Branding', fixtures: 'Fixtures', navigation: 'Navigation',
	pages: 'Pages', schema: 'Schema', other: 'Other',
}

export function CustomizationCard({ c }: { c: OpsCustomization }) {
	const variant = customizationStatusVariant[c.status] ?? 'default'
	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{c.title}</h3>
				<SportsBadge label={c.status.replace('-', ' ')} variant={variant} />
			</div>
			<SportsMeta items={[
				areaLabels[c.area] ?? c.area,
				c.teamApproval ? `Team: ${c.teamApproval}` : null,
				c.reviewDate ? `Review: ${formatSportsDate(c.reviewDate)}` : null,
				c.teamTitle,
			]} />
			{c.implementationNotes && <p className="text-sm">{c.implementationNotes}</p>}
		</SportsCard>
	)
}

export function CustomizationList({ items }: { items: OpsCustomization[] }) {
	if (!items.length) return <SportsEmpty label="customization requests" />
	return (
		<SportsCardGrid cols={2}>
			{items.map(c => <CustomizationCard key={c._id} c={c} />)}
		</SportsCardGrid>
	)
}

// ── Players ────────────────────────────────────────────────────────────────

export function PlayerCard({ p }: { p: OpsPlayer }) {
	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">
					{p.shirtNumber ? `#${p.shirtNumber} ` : ''}{p.displayName}
				</h3>
				<SportsBadge
					label={p.publicProfile ? 'Public' : 'Private'}
					variant={p.publicProfile ? 'success' : 'muted'}
				/>
			</div>
			<SportsMeta items={[p.position, p.squad, p.teamTitle]} />
			<SportsBadge
				label={consentLabels[p.guardianConsent] ?? p.guardianConsent}
				variant={p.guardianConsent === 'granted' ? 'success' : p.guardianConsent === 'withdrawn' ? 'warning' : 'muted'}
			/>
			{p.demoRecord && <SportsBadge label="Demo record" variant="muted" />}
		</SportsCard>
	)
}

export function PlayerList({ players }: { players: OpsPlayer[] }) {
	if (!players.length) return <SportsEmpty label="player records" />
	return (
		<SportsCardGrid cols={3}>
			{players.map(p => <PlayerCard key={p._id} p={p} />)}
		</SportsCardGrid>
	)
}
