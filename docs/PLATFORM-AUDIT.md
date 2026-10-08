# Platform Audit — Unami Sports / Unami Stars
Generated from live codebase and Sanity dataset.

---

## 1. IDENTITY & NAVIGATION — WHAT'S WRONG

### Logo missing on `/` but present on `/unami-stars`
- **Root cause**: `getSite()` uses `'use cache'`. The home page static cache was built before the logo was uploaded. `/unami-stars` got a fresh cache entry after upload.
- **Fix**: Force revalidation — patch the `site` doc to bust the cache, or add `NEXT_DEPLOYMENT_ID` rotation on deploy.
- **Code path**: `src/ui/logo.tsx` → `getSite()` → SITE_QUERY spreads `logo` with only `_ref` (no `asset->`). `urlFor()` and `getImageDimensions()` both work from `_ref` alone — logo renders fine once cache is fresh.

### Nav on `/unami-stars` says "Unami Sports" — correct
- The single `site` doc drives header/footer globally. There is no per-page nav override.
- The nav IS Unami Sports nav — that is correct. The confusion is that `/unami-stars` is a page *within* the Unami Sports site, not a separate site.
- **What user sees as wrong**: the nav links (Home · Unami Stars · Our model · Development · Fixtures · Get involved) are the Unami Sports programme nav — which is correct. The logo says "Unami Stars" (the wordmark we uploaded) but the site title is "Unami Sports". These are mismatched.
- **Fix**: Upload the Unami Sports wordmark (`unami sports.webp`) as the site logo, not the Unami Stars wordmark. The Unami Stars wordmark belongs on the `/unami-stars` page as a page-level image, not the global header.

---

## 2. ROUTE MAP — WHAT EXISTS VS WHAT'S REACHABLE

### CMS-driven routes (via `[[...slug]]` catch-all)
| URL | Sanity doc | Modules | Status |
|-----|-----------|---------|--------|
| `/` | `unami.page.home` | 7 | ✓ Live |
| `/unami-stars` | `unami.page.team` | 7 | ✓ Live |
| `/our-model` | `unami.page.model` | 6 | ✓ Live |
| `/development` | `unami.page.development` | 5 | ✓ Live |
| `/fixtures` | `unami.page.fixtures` | 6 | ✓ Live — BUT collides with sports route |
| `/governance` | `unami.page.governance` | 5 | ✓ Live |
| `/get-involved` | `unami.page.get-involved` | 5 | ✓ Live |
| `/contact` | `unami.page.contact` | 4 | ✓ Live |
| `/accessibility-statement` | `unami.page.accessibility` | 3 | ✓ Live |
| `/404` | `unami.page.not-found` | 1 | ✓ Live (noIndex) |

### Hardcoded sports directory routes
| URL | File | Data source | Status |
|-----|------|-------------|--------|
| `/sports` | `app/(frontend)/sports/page.tsx` | `getPublicSportsTeams/Fixtures/Events/Competitions()` | ✓ Live — shows real data |
| `/teams` | `app/(frontend)/teams/page.tsx` | `getPublicSportsTeams()` | ✓ Live |
| `/teams/unami-stars` | `app/(frontend)/teams/[slug]/page.tsx` | `getPublicSportsTeam(slug)` | ✓ Live |
| `/fixtures` | **COLLISION** — CMS page wins over sports route | — | ⚠️ Sports fixtures route unreachable |
| `/events` | `app/(frontend)/events/page.tsx` | `getPublicSportsEvents()` | ✓ Live |
| `/competitions` | `app/(frontend)/competitions/page.tsx` | `getPublicSportsCompetitions()` | ✓ Live |

### Route collision fix needed
`/fixtures` slug exists in both `unami.page.fixtures` (CMS) and `app/(frontend)/fixtures/page.tsx` (hardcoded).
Next.js resolves: hardcoded routes in `app/` take priority over `[[...slug]]`. So the sports fixtures page DOES win — the CMS page at slug `fixtures` is actually unreachable. The CMS page should be renamed to `fixtures-guide` or merged.

---

## 3. SPORTS DATA — WHAT'S PUBLIC VS PRIVATE

### Public (passes all query filters)
| Type | Doc | Public? | Why |
|------|-----|---------|-----|
| `sports.team` | `seed.sports.team.unami-stars` | ✓ | publicProfile:true, status:active, demoRecord:false |
| `sports.fixture` | friendly-nov | ✓ | publicListing:true, scheduled, team is public |
| `sports.fixture` | friendly-oct-result | ✓ | publicListing:true, completed, has score |
| `sports.fixture` | community-day-match | ✓ | publicListing:true, scheduled |
| `sports.event` | community-day-2026 | ✓ | all 6 readiness checks true |
| `sports.competition` | community-day-2026 | ✓ | all 5 approval checks true |

### Private / operational (not surfaced publicly — correct)
| Type | Doc | Why private |
|------|-----|-------------|
| `sports.player` | all 12 | publicProfile:false, guardianConsent:not-requested, demoRecord:true |
| `sports.stakeholder` | kwagucingo-fa | publicAcknowledgement:false |
| `sports.stakeholder` | unami-foundation | publicAcknowledgement:false |
| `sports.commercial` | kwagucingo-fa | publicRecognitionRequested:false |
| `sports.governance` | safeguarding-policy | status:draft |
| `sports.pilot` | unami-stars-2026 | operational only |
| `sports.resource` | event-budget, kit-donation | operational only |
| `sports.talent` | ref-001 | operational only |
| `sports.training` | both | operational only |
| `sports.support` | nav-question | operational only |
| `sports.customization` | both | operational only |

### Demo says "surface everything" — what needs frontend components
These schema types have NO public-facing frontend page or component:
- `sports.stakeholder` — no route, no component
- `sports.commercial` — no route, no component  
- `sports.governance` — no route, no component
- `sports.pilot` — no route, no component
- `sports.resource` — no route, no component
- `sports.talent` — no route, no component
- `sports.training` — no route, no component
- `sports.support` — no route, no component
- `sports.customization` — no route, no component
- `sports.player` — no public route (by design — consent required)

---

## 4. MODULE WIRING AUDIT

### All modules registered in MODULES_MAP ✓
accordion-list, banner, blog-index, blog-post-content, blog-post-list, breadcrumbs, callout, card-list, countdown, custom-html, feature.bar, form-module, hero.cover, hero.split, hero.video, image-gallery, logo-list, media.split, person-list, prose, quote-list, search-module, stat-list, step-list, tabbed-content, testimonial.feature, video.embed

### Modules with special GROQ projections (in MODULES_QUERY)
- `card-list` — cards[].ctas resolved ✓
- `tabbed-content` — tabs[].content images expanded, ctas resolved ✓
- `image-gallery` — has query.ts ✓
- `logo-list` — logos[]-> dereferenced ✓
- `person-list` — people[]-> dereferenced ✓
- `prose` — images expanded, headings extracted ✓
- `quote-list` — quotes[]-> dereferenced ✓
- `form-module` — has query.ts ✓
- `breadcrumbs` — has query.ts ✓

### Modules with NO special projection (use `...` spread — fine for simple data)
accordion-list, banner, callout, countdown, feature.bar, hero.cover, hero.split, hero.video, media.split, stat-list, step-list, testimonial.feature, video.embed — all work correctly with spread.

### Missing: `ctas` inside `accordion-list` items
The MODULES_QUERY resolves `ctas[]` at the module level but NOT inside `accordion-list.accordions[].ctas` if they exist. Not currently used so not blocking.

---

## 5. WHAT'S NOT SURFACED ON THE DEMO SITE

### Sports operational layer — 9 schema types with no frontend
These are the "commercial layer" the user wants visible. They need:
1. A dedicated page or section per type
2. A GROQ query in `sports-public.ts`  
3. A UI component in `src/ui/sports/components.tsx`
4. A route or CMS page module that renders them

**Proposed surface map:**

| Schema | Where to surface | Visibility |
|--------|-----------------|------------|
| `sports.stakeholder` | `/teams/unami-stars` + `/our-model` | Public acknowledgement flag controls display |
| `sports.commercial` | `/get-involved` + `/teams/unami-stars` | Demo: show arrangement type + purpose, no sensitive terms |
| `sports.governance` | `/governance` | Show doc type, status, version — not full content |
| `sports.pilot` | `/unami-stars` + `/development` | Show stage, services agreed, readiness checks |
| `sports.resource` | `/get-involved` | Show resource type, amount, currency, status |
| `sports.training` | `/development` | Show topic, delivery mode, outcomes |
| `sports.support` | `/development` | Show category, priority, status, resolution |
| `sports.customization` | `/unami-stars` | Show area, request summary, status |
| `sports.player` | `/teams/unami-stars` | Squad list — private by default, demo shows structure |

---

## 6. DUPLICATE DATA TO CLEAN

| Keep | Delete |
|------|--------|
| `seed.sports.team.unami-stars` (demoRecord:false, publicProfile:true) | `unami.sports-team.unami-stars` (demoRecord:true, publicProfile:false) |
| `seed.sports.competition.community-day-2026` | already cleaned |
| `seed.sports.event.community-day-2026` | already cleaned |
| `seed.sports.customization.kit-colours` | `unami.customization.stars-football-demo` (duplicate) |

---

## 7. PRIORITY FIX LIST

1. **Logo**: swap site logo to `unami sports.webp` (programme wordmark), use `unami-stars.webp` as page image on `/unami-stars`
2. **Cache bust**: patch `site` doc to force revalidation so logo appears on `/`
3. **Route collision**: rename CMS page slug `fixtures` → `fixtures-guide` (sports route wins anyway but CMS page is unreachable)
4. **Surface operational layer**: add GROQ queries + UI components + page sections for stakeholder, commercial, governance, pilot, resource, training, support, customization
5. **Delete**: `unami.sports-team.unami-stars` and `unami.customization.stars-football-demo`
6. **Nav**: add `/sports` to header nav (the sports directory overview is the right entry point)
