# Unami Sports — Capability and Actor Audit

**Audit basis:** repository at commit `cb5d3e4` (branch `main`, remote `origin`)
**Purpose:** map every system capability to the actors who can reach it, the authority that gates it, and the boundary between public and Studio-only surfaces. This is an implementation inventory, not a target architecture.

---

## 1. Status vocabulary

| Status | Meaning |
|---|---|
| **PUBLIC** | A public route/query/component renders this capability from published CMS content. No authentication required. |
| **PUBLIC — CONDITIONAL** | Public route exists but data appears only when explicit publication flags and readiness checks pass in GROQ. |
| **PUBLIC — FALLBACK** | Rendered by application code when no CMS document exists; not driven by a CMS record. |
| **STUDIO** | Schema registered and visible in Studio structure. No public route queries this type. |
| **STUDIO — FLAG ONLY** | A field or validation describes a gate, approval, consent or publication choice. It is not a runtime access-control or publication mechanism. |
| **STUDIO — LOG** | Record-keeping schema; no workflow engine, notifications or enforcement. |
| **PARTIAL** | Some pieces exist but the end-to-end workflow, route, persistence or integration is absent. |
| **NOT FOUND** | No implementation located in the repository. |

---

## 2. Actors

| Actor | Description |
|---|---|
| **Visitor** | Unauthenticated public user accessing frontend routes. |
| **CMS editor** | Authenticated Sanity Studio user. Actual project-level roles are configured outside this repository. |
| **Foundation programme owner** | Operational role referenced in schema field labels. Not an authenticated identity in this repo. |
| **Team representative** | Operational role referenced in schema field labels. Not an authenticated identity in this repo. |
| **Crawler / agent** | Search engine, RSS reader, LLM agent or sitemap consumer. |
| **Script operator** | Person running `scripts/seed-unami-demo.mjs` with a write token. |

> Role fields in sports schemas (`operationalOwner`, `foundationOwnerRole`, `teamRepresentativeRole`, etc.) are plain string labels. They do not enforce Sanity document access, partition queries, or authenticate any actor.

---

## 3. Public frontend capabilities

### 3.1 Site chrome and shared layout

| Capability | Route / component | Actors | Authority | Status |
|---|---|---|---|---|
| Skip links and accessibility shell | `src/app/(frontend)/layout.tsx` | Visitor | App code | **PUBLIC** |
| Header, footer, navigation | `src/ui/header/`, `src/ui/footer/` | Visitor | Published `site` singleton + `navigation` documents | **PUBLIC** |
| Announcement banner | `src/ui/announcement/` | Visitor | Published `site.announcement` reference | **PUBLIC** |
| Draft mode banner + visual editing | `src/ui/draft-mode-banner.tsx`; `VisualEditing` | CMS editor (preview session) | Sanity preview cookie + `SANITY_API_READ_TOKEN` | **PUBLIC — PREVIEW** (editor only) |

### 3.2 Page and blog content

| Capability | Route / component | Actors | Authority | Status |
|---|---|---|---|---|
| Generic page rendering | `src/app/(frontend)/[[...slug]]/page.tsx` | Visitor | Published `page` document with matching slug | **PUBLIC** |
| Homepage fallback | `src/ui/sports/home-fallback.tsx` (rendered when no `index` page exists) | Visitor | Application code; no CMS record required | **PUBLIC — FALLBACK** |
| 404 page | `src/app/(frontend)/not-found.tsx` | Visitor | Published `page` with slug `404`; renders empty if absent | **PUBLIC — CONDITIONAL** |
| Blog post | `src/app/(frontend)/blog/[slug]/page.tsx` | Visitor | Published `blog.post` | **PUBLIC** |
| Blog index / listing / filter | `src/modules/blog-index/`, `src/modules/blog-post-list/` | Visitor | Published `blog.post` documents | **PUBLIC** |
| Page modules (all 19 registered types) | `src/modules/index.tsx` + per-module `index.tsx` | Visitor | Module type in `MODULES_MAP` + published page | **PUBLIC** |
| Global / path modules | `src/sanity/schemaTypes/documents/global-module.ts` | Visitor | Published `global-module` document + path match | **PUBLIC** |
| Search (CMS content) | `src/modules/search-module/` | Visitor | Published `page` / `blog.post`; excludes `noIndex` and `404` | **PUBLIC** |
| Google search fallback | `src/modules/search-module/google-results.tsx` | Visitor | External Google service | **PUBLIC — EXTERNAL** |
| Contact form | `src/modules/form-module/` | Visitor | Editor-configured external endpoint; only `contact` identifier renders | **PARTIAL** |

### 3.3 Sports public directory

All sports public queries use `perspective: 'published'`, exclude `demoRecord: true`, and project an explicit field allow-list. No player, venue, match report, financial, or operational fields are projected.

| Capability | Route | Actors | Publication gate | Readiness gate | Fields projected publicly | Status |
|---|---|---|---|---|---|---|
| Sports overview landing | `/sports` | Visitor | — | — | Counts from each query; directory links | **PUBLIC** |
| Team directory | `/teams` | Visitor | `publicProfile == true` | `status == 'active'`, `demoRecord != true`, `defined(slug.current)` | `title`, `slug`, `sport`, `community`, `province`, `description` (plain text) | **PUBLIC — CONDITIONAL** |
| Team detail + activity | `/teams/[slug]` | Visitor | Same as team directory | Same as team directory | Team fields above + eligible fixtures/events/competitions for that team | **PUBLIC — CONDITIONAL** |
| Fixtures and results | `/fixtures` | Visitor | `publicListing == true` | `status in ['scheduled','completed']`, `defined(kickoff)`, linked team active + public + non-demo | `title`, `opponent`, `kickoff`, `status`, score result (completed only), `team.title`, `team.slug` | **PUBLIC — CONDITIONAL** |
| Events | `/events` | Visitor | `publicListing == true` | `status in ['approved','scheduled','delivered']`, all 6 readiness booleans `true`, at least one active public team linked | `title`, `startDateTime`, `endDateTime`, `publicVenueName` | **PUBLIC — CONDITIONAL** |
| Competitions | `/competitions` | Visitor | `publicAnnouncementApproved == true` | `status in ['approved','active','completed']`, all 4 readiness booleans `true`, at least one active public team linked | `title`, `sport`, `format`, `startDate`, `endDate` | **PUBLIC — CONDITIONAL** |

**Fields never projected publicly (enforced by GROQ allow-list):**
- `sports.fixture`: `venue`, `matchReport`, `homeScore`/`awayScore` (raw), `operationalOwner`
- `sports.event`: private venue details, `cancellationPlan`, `teamFeedbackSummary`, `budget` ref, transport/safety notes
- `sports.competition`: `rulesSummary`, `ruleVersion`, `competitionOwnerRole`, `financialResources`, `reviewDate`
- `sports.team`: `season`, `ageGroup`, `operationalOwner`, `status`, `demoRecord`, `publicProfile`

### 3.4 Discovery and metadata surfaces

| Capability | Route | Actors | Authority | Sports records included | Status |
|---|---|---|---|---|---|
| Sitemap | `/sitemap.xml` | Crawler | Published pages/posts + active public non-demo teams | Sports directory roots (`/sports`, `/teams`, `/fixtures`, `/events`, `/competitions`) + eligible team profile URLs | **PUBLIC** |
| RSS feed | `/blog/rss.xml` | Subscriber | Published `blog.post` | None | **PUBLIC** |
| OG image generation | `/api/og` | Visitor / crawler | Published `page` or `blog.post` | None | **PUBLIC** |
| Markdown routes | `/{slug}.md`, `/blog/{slug}.md` | Visitor / agent | Published page/post with `markdown.code` present | None | **PUBLIC — CONDITIONAL** |
| `llms.txt` | `/llms.txt` | Agent | Published pages/posts with curated markdown | None | **PUBLIC** |
| `agents.md` | `/agents.md` | Agent | Same as `llms.txt`; served as `text/markdown` | None | **PUBLIC** |
| SEO metadata + `noIndex` | Per-page `<head>` | Crawler | Published page/post metadata | None | **PUBLIC** |
| Redirects | HTTP 301 via `next.config.ts` | Visitor | Published `redirect` documents | None | **PUBLIC** |

---

## 4. Studio-only operational schemas

All types below are registered in `src/sanity/schemaTypes/index.ts` and placed in `src/sanity/structure.ts`. None appear in any public GROQ query. Their Studio presence is not a privacy guarantee — actual Sanity project permissions are configured outside this repository.

### 4.1 Club operations

| Schema | Studio section | Principal data | Actors (by label) | Validation gates | Public wiring | Status |
|---|---|---|---|---|---|---|
| `sports.player` | Club operations | `displayName`, `team` ref, `squad`, `shirtNumber`, `position`, `introduction`, `image`, `guardianConsent`, `publicProfile`, `demoRecord` | CMS editor; intended team/guardian process | `publicProfile` blocked unless `guardianConsent == 'approved'` | **None.** No public query or route. Youth/consent data must not be published. | **STUDIO — FLAG ONLY** |

### 4.2 Programme operations

| Schema | Studio section | Principal data | Actors (by label) | Validation gates | Public wiring | Status |
|---|---|---|---|---|---|---|
| `sports.pilot` | Programme operations | Team ref, cohort, stage, need, services, readiness booleans (`participationApproved`, `supportScopeAgreed`, `safeguardingPlanAgreed`, `accessRolesTested`), dates, decision, review notes | CMS editor; Foundation programme owner; team representative | Stage `active`/`review`/`completed` requires all 4 readiness booleans | None | **STUDIO — FLAG ONLY** |
| `sports.training` | Programme operations | Team + pilot refs, topic, delivery mode, date, facilitator role, adult participant count, outcomes, materials, follow-up | CMS editor; facilitator | Follow-up status enum | None | **STUDIO — LOG** |
| `sports.support` | Programme operations | Team + pilot refs, reference code, category, description (max 1500 chars), requester role, priority, status, resolution | CMS editor; requester role; Foundation triage owner | Required bounded description; explicit prohibition on passwords, child details, sensitive cases | None. Not an emergency, safeguarding or incident-reporting system. | **STUDIO — LOG** |

### 4.3 Competition operations

| Schema | Studio section | Principal data | Actors (by label) | Validation gates | Public wiring | Status |
|---|---|---|---|---|---|---|
| `sports.competition` | Competition operations | Team array refs, resource array refs, sport, format, status, dates, 4 readiness booleans, `publicAnnouncementApproved`, `demoRecord` | CMS editor; competition owner role | `approved`/`active` requires all 4 readiness booleans | Conditional public projection (title, sport, format, dates) when all gates pass | **PUBLIC — CONDITIONAL** (limited projection) + **STUDIO** (full record) |
| `sports.event` | Competition operations | Competition + team + resource refs, status, dates, `publicVenueName`, 6 readiness booleans, `publicListing`, `demoRecord` | CMS editor; event lead role | `approved`/`scheduled`/`delivered` and `publicListing` require all 6 readiness booleans | Conditional public projection (title, dates, `publicVenueName`) when all gates pass | **PUBLIC — CONDITIONAL** (limited projection) + **STUDIO** (full record) |

### 4.4 Foundation stewardship

| Schema | Studio section | Principal data | Actors (by label) | Validation gates | Public wiring | Status |
|---|---|---|---|---|---|---|
| `sports.stakeholder` | Foundation stewardship | Organization, type, relationship lead, support areas, summary, website, `publicAcknowledgement`, acknowledgement text | CMS editor; Foundation/team relationship lead | Written-approval instruction for public recognition (boolean + text, not verified) | None. No public stakeholder directory or acknowledgement renderer. | **STUDIO — FLAG ONLY** |
| `sports.customization` | Foundation stewardship | Team ref, sport, area, request, team decision, status, Foundation owner, implementation notes, review date | CMS editor; team approver; Foundation delivery owner | Status enum | None | **STUDIO — LOG** |
| `sports.governance` | Foundation stewardship | Team ref, document type, content, owner, status, version, effective/review dates, review note | CMS editor; team/Foundation reviewer | Status enum; template text requires legal/association review before adoption | None. No public policy route. | **STUDIO — LOG** |

### 4.5 Finance and partnerships

| Schema | Studio section | Principal data | Actors (by label) | Validation gates | Public wiring | Status |
|---|---|---|---|---|---|---|
| `sports.commercial` | Finance and partnerships | Stakeholder + team refs, arrangement type, purpose, deliverables, value summary, 4 approval booleans, recognition consent, dates | CMS editor; commercial authority role | `approved`/`active` requires terms/conflict/benefit-cost review and recognition consent if requested | None. No public sponsor display. | **STUDIO — FLAG ONLY** |
| `sports.resource` | Finance and partnerships | Stakeholder + team + event refs, resource type, commitment status, amount (ZAR), restriction, approval, reconciliation | CMS editor; finance role | Nonnegative amounts; record is explicitly not a payment instruction or accounting ledger | None. No public financial surface. | **STUDIO — LOG** |

### 4.6 Restricted pathways

| Schema | Studio section | Principal data | Actors (by label) | Validation gates | Public wiring | Status |
|---|---|---|---|---|---|---|
| `sports.talent` | Restricted pathways | Pseudonymous reference code, team ref, sport, pathway type, age band, status, opt-in/guardian/assent booleans, safeguarding/conflict review, formal representation gate object, non-sensitive notes | CMS editor; authorized pathway reviewer | Progression requires opt-in; under-18 requires guardian process + assent; formal representation progression expressly blocked | None. Explicitly restricted. Never treat as a public profile. | **STUDIO — FLAG ONLY** |

---

## 5. Studio structure taxonomy

`src/sanity/structure.ts` organises the Studio into the following sections. This is editorial taxonomy, not a workflow engine or access-control boundary.

| Section | Document types |
|---|---|
| Global | `site` (singleton), `global-module`, `skill` |
| Pages | `page`, page directories |
| Blog | `blog.post`, `blog.category` |
| Navigation | `navigation`, `redirect` |
| References | `announcement`, `form`, `logo`, `person`, `quote` |
| Club operations | `sports.team`, `sports.player`, `sports.fixture` |
| Programme operations | `sports.pilot`, `sports.training`, `sports.support` |
| Competition operations | `sports.competition`, `sports.event` |
| Foundation stewardship | `sports.stakeholder`, `sports.customization`, `sports.governance` |
| Finance and partnerships | `sports.commercial`, `sports.resource` |
| Restricted pathways | `sports.talent` |
| Drafts | All draft documents (`_originalId in path("drafts.**")`) |

---

## 6. Sports document relationship graph

```
sports.team
  ├── sports.player.team
  ├── sports.fixture.team          → conditional public projection
  ├── sports.pilot.team
  │     ├── sports.training.pilot
  │     └── sports.support.pilot
  ├── sports.training.team
  ├── sports.support.team
  ├── sports.competition.teams[]   → conditional public projection
  │     └── sports.event.competition
  ├── sports.event.teams[]         → conditional public projection
  ├── sports.governance.team
  ├── sports.customization.team
  ├── sports.commercial.team
  ├── sports.resource.team
  └── sports.talent.team

sports.stakeholder
  ├── sports.commercial.stakeholder
  └── sports.resource.sourceStakeholder

sports.resource
  ├── sports.competition.financialResources[]
  ├── sports.event.budget
  └── sports.resource.event
```

**Constraint:** `sports.fixture.competition` is a plain `string` field, not a reference to `sports.competition`. Fixture records are not structurally joined to competition records. This is intentional and must not be converted.

---

## 7. Complete public route inventory

| Route | Source | Sports record access | Auth required |
|---|---|---|---|
| `/` | `[[...slug]]/page.tsx` → CMS `index` page or `SportsHomeFallback` | None in page query; fallback links to sports directories | No |
| `/{slug}` | `[[...slug]]/page.tsx` | None | No |
| `/sports` | `src/app/(frontend)/sports/page.tsx` | Counts from 4 public queries; directory links | No |
| `/teams` | `src/app/(frontend)/teams/page.tsx` | Active public non-demo team profiles | No |
| `/teams/[slug]` | `src/app/(frontend)/teams/[slug]/page.tsx` | Single team profile + eligible activity | No |
| `/fixtures` | `src/app/(frontend)/fixtures/page.tsx` | Approved public fixtures | No |
| `/events` | `src/app/(frontend)/events/page.tsx` | Approved public events | No |
| `/competitions` | `src/app/(frontend)/competitions/page.tsx` | Approved public competitions | No |
| `/blog/[slug]` | `src/app/(frontend)/blog/[slug]/page.tsx` | None | No |
| `/admin/[...tool]` | `src/app/(studio)/admin/` | All registered types (subject to Sanity project permissions) | Sanity account |
| `/api/draft-mode/enable` | Route handler | None | Sanity preview token |
| `/api/draft-mode/disable` | Route handler | None | Preview cookie |
| `/api/og` | Route handler | `page` or `blog.post` only | No |
| `/{slug}.md` | Rewrite → `/api/md/[...slug]` | `page.markdown.code` only | No |
| `/blog/{slug}.md` | Rewrite → `/api/md/[...slug]` | `blog.post.markdown.code` only | No |
| `/blog/rss.xml` | Route handler | None | No |
| `/sitemap.xml` | `src/app/sitemap.ts` | Active public non-demo team URLs + sports directory roots | No |
| `/llms.txt` | `src/app/llms.txt/route.ts` | None | No |
| `/agents.md` | `src/app/agents.md/route.ts` | None | No |

---

## 8. Documented gaps (intentional, not bypassed)

| Gap | Reason | Constraint |
|---|---|---|
| No public player directory | `guardianConsent` validation and youth safeguarding; no public query exists | Must not be added without a separate consent/authorization process |
| No event or competition detail routes (`/events/[slug]`, `/competitions/[slug]`) | `sports.event` and `sports.competition` have no `slug` field | Adding detail routes requires a schema change |
| `sports.fixture.competition` is a string, not a reference | Explicit constraint from prior audit | Must not be converted to a `reference` type |
| No public player images | `sports.player.image` is never projected publicly | Intentional; image publication requires guardian consent |
| No stakeholder acknowledgement renderer | `publicAcknowledgement` boolean exists but no public query or component consumes it | Requires written approval process outside the CMS before implementing |
| No team portal, membership, or authenticated team surfaces | Not implemented | Would require authentication/authorization infrastructure not present in this repo |
| No workflow notifications, scheduled automation, or approval evidence | Boolean/status fields only; no orchestration engine | Not implemented |
| No accounting, payment, ticketing, registration, or competition engine | `sports.resource` and `sports.event` are planning records, not services | Not implemented |
| No sports records in search, RSS, OG, markdown, or `llms.txt` | These surfaces are scoped to `page` and `blog.post` only | Intentional |
| No Sanity Presentation / visual editing resolver for sports routes | Draft resolver covers pages/posts only; sports public queries always use published perspective | Intentional; sports routes are not CMS-page routes |

---

## 9. Authority and privacy boundary summary

1. **Ownership fields are labels.** `operationalOwner`, `foundationOwnerRole`, `teamRepresentativeRole` and similar fields are plain strings. Schema descriptions explicitly state they do not enforce Sanity document access.

2. **No sports authentication or RBAC.** No repository-defined sports session identity, team membership check, per-team query filter, row-level policy, or sports API handler was found.

3. **Validation is not authorization.** Schema validation predicates operate on document field values. A boolean set to `true` does not prove who approved it, when, against which evidence, or whether the required process occurred.

4. **Publication flags are filtering, not access control.** `publicProfile`, `publicListing`, `publicAnnouncementApproved` and readiness booleans are consumed by public GROQ queries. They do not restrict who can read the underlying Sanity document via the API.

5. **Public queries project an explicit allow-list.** Free-text operational details, player data, fixture venue/match report, financial data, and internal workflow documents are not selected. This is enforced by the GROQ projection, not by Sanity dataset permissions.

6. **Deployed dataset permissions are outside this repository.** The absence of a public route for operational types is a code-path fact. Verify Sanity project/dataset/API permissions separately before placing sensitive information in the CMS.

7. **Player and talent records must remain non-public.** Six player records exist (`unami.player.*`), all with `demoRecord: true`, `publicProfile: false`, `guardianConsent: not-requested`. No public query selects them. This must not change without a proper guardian consent and safeguarding review process.

---

## 10. Evidence index

| File | Role |
|---|---|
| `src/app/(frontend)/[[...slug]]/page.tsx` | Generic page renderer + sports fallback |
| `src/app/(frontend)/sports/page.tsx` | Sports overview |
| `src/app/(frontend)/teams/page.tsx` | Team directory |
| `src/app/(frontend)/teams/[slug]/page.tsx` | Team detail |
| `src/app/(frontend)/fixtures/page.tsx` | Fixtures |
| `src/app/(frontend)/events/page.tsx` | Events |
| `src/app/(frontend)/competitions/page.tsx` | Competitions |
| `src/app/(frontend)/blog/[slug]/page.tsx` | Blog post |
| `src/app/(frontend)/not-found.tsx` | 404 handler |
| `src/app/(frontend)/layout.tsx` | Shared layout, skip links, draft mode |
| `src/app/sitemap.ts` | Sitemap including sports directories and team profiles |
| `src/app/llms.txt/route.ts` | LLM agent directions |
| `src/app/agents.md/route.ts` | Agent directions (markdown variant) |
| `src/lib/sports-public.ts` | All 5 public GROQ queries and fetch helpers |
| `src/lib/agent-directions.ts` | Agent directions query |
| `src/lib/env.ts` | Route constants |
| `src/ui/sports/primitives.tsx` | Reusable sports UI primitives |
| `src/ui/sports/components.tsx` | Domain components (Team, Fixture, Event, Competition) |
| `src/ui/sports/directory.tsx` | Backwards-compat re-exports |
| `src/ui/sports/home-fallback.tsx` | Static branded fallback for empty CMS |
| `src/sanity/structure.ts` | Studio taxonomy |
| `src/sanity/schemaTypes/index.ts` | Schema registration |
| `src/sanity/schemaTypes/documents/sports.*.ts` | All 14 sports schemas |
| `src/modules/index.tsx` | Module resolver and MODULES_MAP |
| `scripts/seed-unami-demo.mjs` | Canonical active-state seed |
| `sanity.config.ts` | Studio configuration |
| `next.config.ts` | Next.js config including markdown rewrites |
