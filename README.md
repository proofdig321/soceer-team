# Civic Sports Platform

[![Deploy with Sanity](https://www.sanity.io/static/images/deploy-with-sanity.svg)](https://www.sanity.io/get-started?template=proofdig321/soceer-team)

A community sports platform for grassroots teams. Each team gets their own website, content management system, fixtures, players, events, and competitions — fully controlled by the team, no coding required.

---

## For Teams — Deploy Your Own Platform

This is a **one-click deployment**. You will get:

- Your own website (e.g. `unamistars.vercel.app` or your own domain)
- Your own Studio at `/admin` — where you manage all your content
- Your own Sanity project — your data belongs to you
- Fixtures, players, events, competitions — all built in

### Step 1 — Click Deploy

**[→ Deploy your team platform](https://www.sanity.io/get-started?template=proofdig321/soceer-team)**

This opens a setup wizard. You will need:
- A free [Sanity account](https://www.sanity.io/login) — for your content database
- A free [Vercel account](https://vercel.com/signup) — for your website hosting
- A [GitHub account](https://github.com/signup) — to connect the two

The wizard handles everything else automatically.

---

### Step 2 — Open Your Studio

Once deployed, go to:

```
https://your-site.vercel.app/admin
```

This is your Studio — your private content management system. Only people you invite can access it.

---

### Step 3 — Create Your Site Document

In the Studio left sidebar, click **Site**.

Fill in:

| Field | Example (Unami Stars) | Your value |
|---|---|---|
| Title | `Unami Stars` | Your team name |
| Logo | Upload your badge/crest | Your logo file |
| Header navigation | Select your header nav | Create one first (see Step 5) |
| Footer navigation | Select your footer nav | Create one first (see Step 5) |

Click **Publish**.

> The Site document controls your logo, navigation, and global settings. Nothing will show on your website until this is published.

---

### Step 4 — Create Your Homepage

In the Studio sidebar, click **Pages** → **New Page**.

| Field | Example (Unami Stars) | Your value |
|---|---|---|
| Title | `Home` | `Home` |
| Slug | `index` | `index` (must be exactly this) |

Then add modules to build your page. Unami Stars uses:

- **Hero (Cover)** — big banner with team name and call-to-action buttons
- **Stat List** — season stats (players, fixtures, wins)
- **Feature Bar** — highlights (fixtures, players, competitions, events)

Click **Publish**.

> The slug `index` is your homepage. Any other slug becomes a page at that URL — e.g. slug `fixtures` becomes `yoursite.com/fixtures`.

---

### Step 5 — Create Your Navigation

In the Studio sidebar, click **Navigation** → **New Navigation**.

**Header navigation** (Unami Stars example):

| Label | Link |
|---|---|
| Home | Page: Home |
| Fixtures | Page: Fixtures |
| Players | Page: Players |
| Events | Page: Events |
| Competitions | Page: Competitions |

**Footer navigation** (Unami Stars example):

| Label | Link |
|---|---|
| Fixtures | Page: Fixtures |
| Players | Page: Players |
| Events | Page: Events |
| Competitions | Page: Competitions |
| Contact | Page: Contact |

Create both, publish them, then go back to your **Site** document and select them in the Header and Footer fields.

---

### Step 6 — Add Your Sports Data

In the Studio sidebar you will find:

**Teams**
Create your team record. This is the data record that links to your players, fixtures, and competitions.

| Field | Example (Unami Stars) |
|---|---|
| Name | `Unami Stars FC` |
| Sport | `Football` |
| Age group | `U19` |
| Season | `2026` |
| Community | `Kwagucingo, KwaZulu-Natal` |
| Public profile | On |

**Players**
Add each registered player. Set **Guardian consent** to `Approved` and **Public profile** to On before a player appears on your website.

| Field | Example |
|---|---|
| Display name | `Sipho D.` (abbreviated for safeguarding) |
| Position | `Goalkeeper` |
| Shirt number | `1` |
| Team | Select your team |
| Guardian consent | `Approved` |
| Public profile | On |

> Player surnames should be abbreviated or initials only. These are minors. Only publish what guardian consent covers.

**Fixtures**
Add each match — past and upcoming.

| Field | Example |
|---|---|
| Title | `Unami Stars vs Riverside FC` |
| Team | Select your team |
| Opponent | `Riverside FC` |
| Kickoff | `15 Oct 2026 14:00` |
| Venue | `Kwagucingo Ground` |
| Status | `Completed` |
| Score | `2 – 1` |
| Public listing | On |

**Events**
Add community events, training days, match days.

| Field | Example |
|---|---|
| Title | `Community Day 2026` |
| Start | `20 Dec 2026 10:00` |
| End | `20 Dec 2026 17:00` |
| Venue | `Kwagucingo Ground` |
| Public listing | On |

**Competitions**
Add leagues or cups your team is registered in.

| Field | Example |
|---|---|
| Title | `Kwagucingo Community League` |
| Season | `2026` |
| Format | `League` |
| Status | `Active` |
| Public announcement approved | On |

---

### Step 7 — Create Your Content Pages

Create a page for each section of your site. Use the slug that matches your navigation links.

| Page title | Slug | Suggested modules |
|---|---|---|
| Fixtures | `fixtures` | Hero, Sports Fixtures |
| Players | `players` | Hero, Sports Players |
| Events | `events` | Hero, Sports Events |
| Competitions | `competitions` | Hero, Sports Fixtures |
| Contact | `contact` | Hero, Card List |
| 404 | `404` | Callout |

---

### Step 8 — Set Your Domain (Optional)

By default your site is at `your-project.vercel.app`.

To use your own domain (e.g. `unamistars.co.za`):

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Open your project → **Settings** → **Domains**
3. Add your domain and follow the DNS instructions

Then update the `NEXT_PUBLIC_BASE_URL` environment variable in Vercel to match your new domain.

---

### Step 9 — Invite Your Team Editor

To let someone else manage content without giving them your login:

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Open your project → **Members** → **Invite**
3. Set their role to **Editor**

They will get an email invite and can log into the Studio directly.

---

## What Each Page Looks Like

**Unami Stars** is a live example of this platform:

| Section | URL |
|---|---|
| Homepage | `/stars` |
| Fixtures | `/stars/fixtures` |
| Players | `/stars/players` |
| Events | `/stars/events` |
| Competitions | `/stars/competitions` |

---

## Safeguarding Notes

This platform is used by youth teams. Follow these rules:

- **Never publish a player's full name** without explicit guardian consent
- Use abbreviated surnames or initials (e.g. `Sipho D.` not `Sipho Dlamini`)
- Set **Guardian consent** to `Approved` before enabling **Public profile**
- Do not publish dates of birth, addresses, or school names
- If in doubt, leave **Public profile** off

---

## Support

For platform issues, raise an issue at:
[github.com/proofdig321/soceer-team/issues](https://github.com/proofdig321/soceer-team/issues)
