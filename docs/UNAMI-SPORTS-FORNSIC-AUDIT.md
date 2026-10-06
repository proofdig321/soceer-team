# Unami Sports — Forensic Audit of the Current Implementation

## Scope and method

This report audits the actual implementation of Unami Sports as it exists in this repository. It does not assess intended future capabilities or the programme document as a design target. The implementation is the authority for what is actually wired.

The key finding is that the current system is best described as a configured Sanity CMS and generic Next.js content site with a set of sports-specific data schemas and workflow records. It is not a fully wired sports operations platform, team-management system, auth-controlled club system, or public sports portal.

---

## Executive summary

The current Unami Sports implementation consists of:

- a general-purpose content site built with Next.js App Router and Sanity Studio (`src/app`, `src/sanity`, `src/modules`)
- a set of sports-specific CMS document schemas under `src/sanity/schemaTypes/documents/`
- a Studio structure for operational records (`src/sanity/structure.ts`)
- a demo seeding script (`scripts/seed-unami-demo.mjs`) that creates illustrative team, pilot, event, resource and stakeholder records and patches the homepage with generic modules

What is actually wired today:

- public pages are assembled from generic page/module records (`page`, `global-module`, `modules[]`)
- sports records exist as structured Sanity documents and Studio categories
- workflow-state logic exists in schema validation for readiness and approval rules
- the system supports internal record management and operational planning, but not a complete sports application workflow

What is not wired today:

- no dedicated public team pages or sports-specific frontend routes
- no sports-specific data access layer or API handlers
- no authentication/authorization model for team-vs-Foundation roles
- no database RLS or server-side enforcement beyond field-level schema validation
- no real club management, member management, roster enforcement, finance ledger, requirement tracking, or incident system

---

## 1) Current system inventory

### 1.1 Public website and page composition

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Generic public page rendering | `src/app/(frontend)/[[...slug]]/page.tsx` | Resolves the route slug, fetches a `page` document and renders its modules | `page` docs, `modules[]`, page metadata | public visitor, CMS editor | CMS editor publishes page; Next.js renders it | WIRED |
| Module rendering | `src/modules/index.tsx` | Maps `_type` values to frontend React components | module data in `page.modules[]` | public visitor, CMS editor | CMS content + code mapping | WIRED |
| CMS page document | `src/sanity/schemaTypes/documents/page.ts` | Defines page title, content modules, markdown output, metadata | `page.title`, `modules`, `metadata`, `markdown` | CMS editor | editor publishes/updates page | WIRED |
| Site branding and navigation | `src/sanity/schemaTypes/documents/site.ts` | Defines shared site settings, navigation, CTAs, OG image | `site` singleton | CMS editor | site owner/admin | WIRED |

Evidence: `src/app/(frontend)/[[...slug]]/page.tsx` queries `*[_type == 'page' ...]` and composes modules; `src/modules/index.tsx` contains a fixed `MODULES_MAP` with general modules like `hero.cover`, `card-list`, `step-list`, `form-module`, etc., but no `sports.*` module types.

### 1.2 Sports-specific CMS records

These are registered in the schema and exposed in the Studio structure:

- `src/sanity/schemaTypes/index.ts`
- `src/sanity/structure.ts`

The Studio lists the following Unami Sports document types:

- `sports.team`
- `sports.player`
- `sports.fixture`
- `sports.pilot`
- `sports.training`
- `sports.support`
- `sports.competition`
- `sports.event`
- `sports.stakeholder`
- `sports.customization`
- `sports.governance`
- `sports.commercial`
- `sports.resource`
- `sports.talent`

These are all schema definitions, not necessarily public features. The codebase records them as structured workflow documents for operational planning and governance.

---

## 2) Capability domains and evidence

### 2.1 Team identity and team records

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Team record | `src/sanity/schemaTypes/documents/sports.team.ts` | Stores team identity, sport, community, status, public profile flag | `title`, `slug`, `sport`, `community`, `province`, `description`, `status`, `publicProfile` | CMS editor; operational team admin | workflow label only; no enforcement | PARTIALLY WIRED |
| Team page/public profile concept | `publicProfile` flag in `sports.team` | Indicates whether a team profile is intended to be public | boolean flag in the document | team admin / CMS editor | flag set by editor; no public route is bound to it | PRESENT BUT NOT ENFORCED |

Important finding: the schema explicitly says:

> `operationalOwner: 'Workflow label only; it does not enforce document access. Configure Sanity roles separately.'`

This is a direct admission that the document label does not implement real access control.

### 2.2 Player profiles, safeguarding and consent

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Player profile record | `src/sanity/schemaTypes/documents/sports.player.ts` | Stores display name, squad, playing role, intro, image, consent state | `displayName`, `team`, `squad`, `shirtNumber`, `position`, `guardianConsent`, `publicProfile` | CMS editor, team admin | CMS editor; validation only | PARTIALLY WIRED |
| Guardrails for youth publication | `guardianConsent` + validation rule in `sports.player.ts` | Prevents public publishing unless guardian consent is approved | consent state + `publicProfile` | team admin / editor | schema validation (not true auth) | PRESENT BUT NOT ENFORCED |

The schema includes a custom validation:

> `publicProfile` cannot be true unless `guardianConsent === 'approved'`

This is field-level validation, not a true authorization layer.

### 2.3 Fixtures and results workflow

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Fixture record | `src/sanity/schemaTypes/documents/sports.fixture.ts` | Stores match details, result, venue, status, public listing flag | `title`, `team`, `opponent`, `kickoff`, `venue`, `status`, `publicListing` | CMS editor, team admin | editor decides; no enforcement | PARTIALLY WIRED |
| Public listing gate | `publicListing` flag | Stores whether a fixture may appear publicly | boolean state | team admin/editor | document-level state only | PRESENT BUT NOT ENFORCED |

The schema warns:

> `Team approval required; consider safeguarding and travel privacy before publishing youth fixtures.`

Again, this is an operational reminder and validation label, not a secure enforcement mechanism.

### 2.4 Pilot readiness and programme activation model

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Pilot workflow record | `src/sanity/schemaTypes/documents/sports.pilot.ts` | Tracks pilot need, stage, readiness gates, review outcome | `team`, `cohort`, `stage`, `need`, `participationApproved`, `supportScopeAgreed`, `safeguardingPlanAgreed`, `accessRolesTested` | programme operator, team rep | team and Foundation roles are recorded as strings | WIRED AS WORKFLOW RECORD |
| Readiness gate logic | custom validation in `sports.pilot.ts` | Prevents active/review/completed state unless key conditions are met | boolean readiness fields | administrator/editor | schema validation only | PRESENT BUT NOT ENFORCED |

This is a meaningful operational record, but it is not a live pilot-management engine. It does not create tasks, approvals, escalations, or enforcement.

### 2.5 Platform support queue

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Support request logging | `src/sanity/schemaTypes/documents/sports.support.ts` | Records platform issues and their triage state | `reference`, `title`, `team`, `pilot`, `category`, `description`, `priority`, `status`, `resolution` | team admin, programme/operator | requester role + foundation owner role | WIRED AS REQUEST LOG |
| Escalation/triage | `status`, `priority`, `foundationOwnerRole` | Assigns operational handling state | status and owner fields | Foundation operator | field values only | PARTIALLY WIRED |

This is a structured support ticket log, not a secure service desk or incident platform. The schema explicitly warns it is not an emergency, safeguarding, incident-reporting, or confidential case system.

### 2.6 Training and capability coverage

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Training record | `src/sanity/schemaTypes/documents/sports.training.ts` | Tracks training session, topic, facilitator, participant count, outcomes, follow-up | `title`, `team`, `pilot`, `topic`, `deliveryMode`, `materials`, `outcomes`, `followupStatus` | team admin, programme facilitator | editor-defined | WIRED AS LOG |

This records learning status and follow-up but does not enforce training completion, certification, or access granting.

### 2.7 Competition and event planning

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Competition record | `src/sanity/schemaTypes/documents/sports.competition.ts` | Tracks competition concept, rules summary, readiness, budget readiness | `title`, `sport`, `format`, `status`, `teams`, `teamApprovalComplete`, `budgetApproved` | programme operator, team admins | schema validation only | WIRED AS PLANNING RECORD |
| Event record | `src/sanity/schemaTypes/documents/sports.event.ts` | Tracks event readiness, safety, venue, budget, public listing | `status`, `teamApprovalsComplete`, `venueConfirmed`, `safetyPlanApproved`, `firstAidConfirmed`, `budget`, `publicListing` | event lead, team admin, programme operator | schema validation only | WIRED AS PLANNING RECORD |

The readiness rules are meaningful operational gates, but they do not integrate with a ticketing system, registration platform, or live event engine.

### 2.8 Stakeholders, commercial relationships and resources

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Stakeholder record | `src/sanity/schemaTypes/documents/sports.stakeholder.ts` | Stores org relationships and acknowledgement state | `organization`, `organizationType`, `relationshipLead`, `supportAreas`, `publicAcknowledgementText` | Programme operator | editor-defined; no enforcement | WIRED AS RELATION RECORD |
| Partnership/commercial record | `src/sanity/schemaTypes/documents/sports.commercial.ts` | Tracks sponsor, grant, donation, service agreement terms | `arrangementType`, `stakeholder`, `purpose`, `deliverables`, approval fields | programme operator, team admin | schema validation only | WIRED AS CONTRACT RECORD |
| Resource/budget record | `src/sanity/schemaTypes/documents/sports.resource.ts` | Tracks financial/resource flows, restriction status and reconciliation | `resourceType`, `amount`, `currency`, `sourceStakeholder`, `team`, `event`, `restrictionStatus` | finance role / programme operator | role labels only; no ledger enforcement | PARTIALLY WIRED |

This is governance and bookkeeping metadata, not an accounting system. The schema itself describes the amount field as not being a payment instruction or accounting ledger.

### 2.9 Governance documents and policy records

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Governance document CMS | `src/sanity/schemaTypes/documents/sports.governance.ts` | Stores constitution, policy and governance content drafts | `documentType`, `team`, `owner`, `status`, `version`, `content` | team admin / organisation admin | owner label only | WIRED AS POLICY RECORD |

The schema says clearly: `Operational responsibility only; Sanity access permissions are configured separately.` It does not implement an actual governance approval workflow.

### 2.10 Talent pathway review (restricted pathway)

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Talent pathway review | `src/sanity/schemaTypes/documents/sports.talent.ts` | Tracks opt-in, safeguarding review, conflict review and formal representation gate | `referenceCode`, `team`, `pathwayType`, `participantOptIn`, `guardianProcessConfirmed`, etc. | programme operator | schema validation and policy gate only | WIRED AS REVIEW CHECKLIST |

The schema explicitly blocks formal representation by workflow logic while noting:

> `Formal representation is not enabled by this CMS workflow. Obtain specialist legal/sport-rule approval and build a separate authorised process first.`

This is a policy guardrail, not a functioning agent/representation system.

### 2.11 Demo content and homepage patching

| Capability | Component | Function | Data | Actor | Authority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Demo dataset creation | `scripts/seed-unami-demo.mjs` | Creates illustrative pilot, support, competition, resource and event records and patches the homepage | `sports.*` docs + homepage module config | project maintainer with write token | Sanity write permission | WIRED FOR DEMO ONLY |

This script is explicitly a demonstration seed and does not represent production system behaviour. It creates sample records like `DEMO ONLY`, `DEMO PROPOSAL`, and `DEMO FORECAST` items and adds generic homepage modules to the public home page.

---

## 3) What is not present in the actual implementation

### 3.1 No dedicated sports app or public sports portal

The public rendering stack is generic and module-based. `src/modules/index.tsx` contains no `sports.team`, `sports.fixture`, `sports.pilot`, `sports.competition` or similar runtime components in `MODULES_MAP`.

There are also no routes in `src/app` dedicated to sports entities such as team pages, fixture feeds, competition calendars, or player directories.

Conclusion: the public website is not a wired sports system. It is a generic page/editor framework onto which sports-related content may be inserted as text modules or schema records.

### 3.2 No authentication or authorization enforcement

This repo contains no custom auth implementation, no permission layer, and no database RLS or server-side access checks for the sports documents.

Strong evidence:

- the schema fields themselves state `Workflow label only; it does not enforce document access. Configure Sanity roles separately.` (`sports.team.ts`, `sports.player.ts`, `sports.fixture.ts`, `sports.stakeholder.ts`, `sports.governance.ts`, `sports.customization.ts`)
- there are no auth/role files under `src/` for Unami Sports; no `middleware`, `auth`, `rbac`, or `permission` implementation is present
- the schemas rely on validation rules and UI labels, not an access-control system

Status: `NOT FOUND` for real auth/authorization enforcement.

### 3.3 No database or secure record system beyond Sanity documents

The system uses Sanity as a document store and the Studio to manage records. There is no custom database schema, no SQL layer, no row-level-policy implementation, no secure data model for sensitive youth data, and no automated enforcement for data retention, access restrictions, or approval evidence.

### 3.4 No real workflow engine or operational automation

The readiness/approval fields exist, but there is no process runner, no scheduled tasking, no permission-based routing, no workflow execution engine, no notifications, no task assignment, and no audit trail beyond the edited document state.

The fields and validations are useful operational metadata, but they are not a secure live system.

---

## 4) Current capability baseline

### Wired today

- generic content-site publishing
- CMS-managed page and module composition
- sports-document schema registry and Studio taxonomy
- team, fixture, player, pilot, support, competition, event, stakeholder, governance, commercial and talent records
- validation-driven workflow gates for readiness and approval states
- demo content creation script for illustrative Unami Stars content

### Partially wired

- team identity management as record metadata
- player profile and youth-consent handling as document fields
- fixture and event planning as structured planning records
- support queue and training logs as structured records
- commercial/resource/governance records as metadata workflows

### Present but not enforced

- all authority claims expressed as role labels or boolean flags
- public-profile publication flags
- “team approval” and “Foundation owner” labels
- “approved for public acknowledgement” and other rule-based states

### Designed/documented but not functional in code

- a real operating partnership model
- real team membership enforcement
- permission separation between team and Foundation
- youth data consent enforcement
- finance/contract ledger functionality
- team admin vs. Foundation admin access management
- legal/association checks integrated into a live system

### Not found

- dedicated sports applications or routes
- team management dashboards
- authenticated team portal
- foundation/club role enforcement
- RLS or database policy enforcement
- real data ownership separation implemented in code
- actual secure workflow for safeguarding/consent/representation

---

## 5) Bottom-line conclusion

The current Unami Sports implementation is a structured content-and-workflow foundation, not a functioning sports operations platform.

It currently provides:

- authoring and publishing infrastructure for a generic website
- a sports-specific schema layer for teams, fixtures, pilots, competitions, stakeholders, finance/resource records, governance and support
- operational-state tracking through Sanity document records and schema validation

It does not currently provide:

- authenticated team management
- enforced role separation between team and Foundation
- secure youth-data management
- real club, membership, roster or fixture automation
- a live public sports portal for team records, fixtures, competitions or talent pathways
- a complete system of ownership and enforcement beyond documented roles and validation rules

The system is therefore best understood as a content-management and governance-record layer for an emerging programme, not as an operationally enforced sports platform.

---

## 6) Key evidence files

- `src/sanity/schemaTypes/index.ts`
- `src/sanity/structure.ts`
- `src/app/(frontend)/[[...slug]]/page.tsx`
- `src/modules/index.tsx`
- `src/sanity/schemaTypes/documents/sports.team.ts`
- `src/sanity/schemaTypes/documents/sports.player.ts`
- `src/sanity/schemaTypes/documents/sports.fixture.ts`
- `src/sanity/schemaTypes/documents/sports.pilot.ts`
- `src/sanity/schemaTypes/documents/sports.support.ts`
- `src/sanity/schemaTypes/documents/sports.training.ts`
- `src/sanity/schemaTypes/documents/sports.competition.ts`
- `src/sanity/schemaTypes/documents/sports.event.ts`
- `src/sanity/schemaTypes/documents/sports.stakeholder.ts`
- `src/sanity/schemaTypes/documents/sports.commercial.ts`
- `src/sanity/schemaTypes/documents/sports.resource.ts`
- `src/sanity/schemaTypes/documents/sports.governance.ts`
- `src/sanity/schemaTypes/documents/sports.talent.ts`
- `scripts/seed-unami-demo.mjs`
