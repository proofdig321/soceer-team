/**
 * Fresh seed — clean architecture
 *
 * Unami Sports  → programme landing  /
 * Unami Stars   → fan platform       /stars/...
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const client = createClient({
  projectId: '4e4wulgj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

// ─── Logo asset refs ────────────────────────────────────────────────────────
const SPORTS_LOGO = 'image-ad2716a1593b8e8962104698b949523c0feed5d2-640x154-webp' // unami-sports-wordmark.webp
const STARS_LOGO  = 'image-4b032d9ebd368d50b7d0a808aaa020dd0438dd61-640x154-webp' // unami-stars-wordmark.webp

const img = (ref) => ({ _type: 'image', asset: { _type: 'reference', _ref: ref } })
const ref = (id)  => ({ _type: 'reference', _ref: id })

// ─── Helpers ─────────────────────────────────────────────────────────────────
const slug  = (s) => ({ _type: 'metadata', slug: { _type: 'slug', current: s } })
const rawSlug = (s) => ({ _type: 'slug', current: s })
const cta   = (label, href) => ({ _type: 'cta', _key: label.replace(/\s/g,''), label, link: { _type: 'link', type: 'internal', internal: href } })
const ctaExt = (label, href) => ({ _type: 'cta', _key: label.replace(/\s/g,''), label, link: { _type: 'link', type: 'external', external: href } })

const hero = (key, pretitle, title, intro, ctas=[]) => ({
  _type: 'hero.split', _key: key,
  pretitle, title, intro, ctas,
})

const heroCover = (key, pretitle, title, intro, ctas=[]) => ({
  _type: 'hero.cover', _key: key,
  pretitle, title, intro, ctas,
})

const banner = (key, content, ctas=[]) => ({
  _type: 'banner', _key: key, content, ctas,
})

const featureBar = (key, items) => ({
  _type: 'feature.bar', _key: key,
  items: items.map(([icon,title,body],i) => ({ _type:'feature', _key:`f${i}`, icon, title, body })),
})

const statList = (key, items) => ({
  _type: 'stat-list', _key: key,
  items: items.map(([value,label],i) => ({ _type:'stat', _key:`s${i}`, value, label })),
})

const cardList = (key, title, items) => ({
  _type: 'card-list', _key: key, title,
  items: items.map(([title,body,icon],i) => ({ _type:'card', _key:`c${i}`, title, body, icon })),
})

const stepList = (key, title, items) => ({
  _type: 'step-list', _key: key, title,
  items: items.map(([title,body],i) => ({ _type:'step', _key:`st${i}`, title, body })),
})

const callout = (key, title, body, ctas=[]) => ({
  _type: 'callout', _key: key, title, body, ctas,
})

const prose = (key, content) => ({
  _type: 'prose', _key: key,
  content: [{ _type:'block', _key:'b0', style:'normal', markDefs:[], children:[{ _type:'span', _key:'sp0', text: content, marks:[] }] }],
})

const accordion = (key, title, items) => ({
  _type: 'accordion-list', _key: key, title,
  items: items.map(([q,a],i) => ({ _type:'accordion', _key:`ac${i}`, title:q, body:a })),
})

// ─── Docs ─────────────────────────────────────────────────────────────────────
const docs = [

  // ── SITE ──────────────────────────────────────────────────────────────────
  {
    _id: 'site',
    _type: 'site',
    title: 'Unami Sports',
    logo: {
      _type: 'logo',
      image: {
        default: img(SPORTS_LOGO),
        light:   img(SPORTS_LOGO),
        dark:    img(SPORTS_LOGO),
      },
    },
    ogimage: img('image-cf19a28cfcf50aef378cd8ee3db188fda4d22021-1213x1321-png'),
  },

  // ── NAVIGATION — Unami Sports (programme landing) ─────────────────────────
  {
    _id: 'navigation.sports.header',
    _type: 'navigation',
    title: 'Unami Sports – Header',
    items: [
      { _type:'link', _key:'home',        type:'internal', label:'Home',        internal:'/' },
      { _type:'link', _key:'model',       type:'internal', label:'Our Model',   internal:'/model' },
      { _type:'link', _key:'pilots',      type:'internal', label:'Pilots',      internal:'/pilots' },
      { _type:'link', _key:'partners',    type:'internal', label:'Partners',    internal:'/partners' },
      { _type:'link', _key:'getinvolved', type:'internal', label:'Get Involved',internal:'/get-involved' },
      { _type:'link', _key:'contact',     type:'internal', label:'Contact',     internal:'/contact' },
    ],
  },
  {
    _id: 'navigation.sports.footer',
    _type: 'navigation',
    title: 'Unami Sports – Footer',
    items: [
      { _type:'link', _key:'model',       type:'internal', label:'Our Model',   internal:'/model' },
      { _type:'link', _key:'pilots',      type:'internal', label:'Pilots',      internal:'/pilots' },
      { _type:'link', _key:'partners',    type:'internal', label:'Partners',    internal:'/partners' },
      { _type:'link', _key:'getinvolved', type:'internal', label:'Get Involved',internal:'/get-involved' },
      { _type:'link', _key:'contact',     type:'internal', label:'Contact',     internal:'/contact' },
      { _type:'link', _key:'stars',       type:'internal', label:'Unami Stars ↗',internal:'/stars' },
    ],
  },

  // ── NAVIGATION — Unami Stars (fan platform) ───────────────────────────────
  {
    _id: 'navigation.stars.header',
    _type: 'navigation',
    title: 'Unami Stars – Header',
    items: [
      { _type:'link', _key:'home',         type:'internal', label:'Home',         internal:'/stars' },
      { _type:'link', _key:'teams',        type:'internal', label:'Teams',        internal:'/stars/teams' },
      { _type:'link', _key:'players',      type:'internal', label:'Players',      internal:'/stars/players' },
      { _type:'link', _key:'fixtures',     type:'internal', label:'Fixtures',     internal:'/stars/fixtures' },
      { _type:'link', _key:'events',       type:'internal', label:'Events',       internal:'/stars/events' },
      { _type:'link', _key:'competitions', type:'internal', label:'Competitions', internal:'/stars/competitions' },
    ],
  },
  {
    _id: 'navigation.stars.footer',
    _type: 'navigation',
    title: 'Unami Stars – Footer',
    items: [
      { _type:'link', _key:'teams',        type:'internal', label:'Teams',        internal:'/stars/teams' },
      { _type:'link', _key:'players',      type:'internal', label:'Players',      internal:'/stars/players' },
      { _type:'link', _key:'fixtures',     type:'internal', label:'Fixtures',     internal:'/stars/fixtures' },
      { _type:'link', _key:'events',       type:'internal', label:'Events',       internal:'/stars/events' },
      { _type:'link', _key:'competitions', type:'internal', label:'Competitions', internal:'/stars/competitions' },
      { _type:'link', _key:'back',         type:'internal', label:'← Unami Sports', internal:'/' },
    ],
  },

  // ── UNAMI SPORTS PAGES ────────────────────────────────────────────────────

  // Home /
  {
    _id: 'page.sports.home',
    _type: 'page',
    title: 'Home',
    metadata: slug('index'),
    modules: [
      heroCover('hero', 'Technology for Good', 'Sport that changes lives', 'Unami Sports partners with community football associations to deliver safe, structured, and sustainable grassroots programmes across South Africa.', [
        cta('Explore Our Model', '/model'),
        cta('See Unami Stars', '/stars'),
      ]),
      statList('stats', [
        ['1', 'Pilot Programme'],
        ['6', 'Players Registered'],
        ['3', 'Fixtures Played'],
        ['100%', 'Community-Led'],
      ]),
      featureBar('features', [
        ['🏟️', 'Structured Leagues', 'Age-appropriate competitions with proper fixtures, referees, and results tracking.'],
        ['🛡️', 'Safeguarding First', 'Every programme meets national safeguarding standards before launch.'],
        ['📊', 'Data-Driven', 'Real-time dashboards for clubs, coaches, and programme managers.'],
        ['🤝', 'Partnership Model', 'We work with existing FAs — not around them.'],
      ]),
      callout('cta-stars', 'See it in action', 'Unami Stars is our live pilot — a community football team running on the full Unami Sports platform.', [
        cta('Visit Unami Stars', '/stars'),
      ]),
    ],
  },

  // Our Model /model
  {
    _id: 'page.sports.model',
    _type: 'page',
    title: 'Our Model',
    metadata: slug('model'),
    modules: [
      hero('hero', 'How We Work', 'The Unami Sports Model', 'A structured, technology-enabled approach to community sport — built for scale, designed for people.'),
      stepList('steps', 'From Partnership to Platform', [
        ['Identify a Partner FA', 'We work with established football associations who have community trust and existing player bases.'],
        ['Governance Readiness', 'Together we establish safeguarding policies, constitutions, and compliance frameworks.'],
        ['Platform Onboarding', 'Teams, players, fixtures, and competitions are registered on the Unami Sports platform.'],
        ['Live Operations', 'Fixtures are scheduled, results recorded, and standings updated in real time.'],
        ['Review & Scale', 'Quarterly reviews assess impact. Successful pilots expand to new regions.'],
      ]),
      featureBar('pillars', [
        ['📋', 'Governance', 'Constitutions, safeguarding, and compliance built in from day one.'],
        ['💻', 'Technology', 'Purpose-built platform for grassroots sport management.'],
        ['🌍', 'Community', 'Programmes designed with and for the communities they serve.'],
        ['📈', 'Impact', 'Measurable outcomes tracked across every programme.'],
      ]),
      callout('cta', 'Want to partner with us?', 'If you run a community football association and want to explore a partnership, we want to hear from you.', [
        cta('Get In Touch', '/contact'),
      ]),
    ],
  },

  // Pilots /pilots
  {
    _id: 'page.sports.pilots',
    _type: 'page',
    title: 'Pilots',
    metadata: slug('pilots'),
    modules: [
      hero('hero', 'Live Programmes', 'Our Pilot Programmes', 'Each pilot is a real community partnership — testing, learning, and proving the model works.'),
      cardList('pilots', 'Current Pilots', [
        ['Unami Stars FC', 'Kwagucingo FA · Launched 2026 · 6 registered players · 3 fixtures completed', '⭐'],
        ['More Coming Soon', 'We are in conversations with three additional FAs across Gauteng and KwaZulu-Natal.', '🔜'],
      ]),
      statList('stats', [
        ['1', 'Active Pilot'],
        ['6', 'Players'],
        ['3', 'Fixtures'],
        ['2026', 'Launch Year'],
      ]),
      callout('cta', 'Follow the pilot live', 'Track Unami Stars fixtures, results, and standings on the platform.', [
        cta('Go to Unami Stars', '/stars'),
      ]),
    ],
  },

  // Partners /partners
  {
    _id: 'page.sports.partners',
    _type: 'page',
    title: 'Partners',
    metadata: slug('partners'),
    modules: [
      hero('hero', 'Who We Work With', 'Our Partners', 'Unami Sports is built on partnerships — with football associations, funders, and community organisations.'),
      cardList('partners', 'Current Partners', [
        ['Kwagucingo FA', 'Our founding football association partner. Home of the Unami Stars pilot programme.', '🤝'],
        ['Unami Foundation', 'The parent organisation funding and governing the Unami Sports programme.', '🏛️'],
      ]),
      accordion('faq', 'Partnership FAQs', [
        ['How do we become a partner FA?', 'Contact us via the Get Involved page. We will arrange an initial call to assess fit and readiness.'],
        ['Is there a cost to partner FAs?', 'No. Unami Sports provides the platform and support at no cost to community FAs during the pilot phase.'],
        ['What do you need from a partner FA?', 'An existing player base, a commitment to safeguarding standards, and a designated programme coordinator.'],
      ]),
      callout('cta', 'Become a partner', 'We are actively looking for community FAs to join the programme.', [
        cta('Get Involved', '/get-involved'),
      ]),
    ],
  },

  // Get Involved /get-involved
  {
    _id: 'page.sports.get-involved',
    _type: 'page',
    title: 'Get Involved',
    metadata: slug('get-involved'),
    modules: [
      hero('hero', 'Join the Movement', 'Get Involved', 'Whether you run a football association, want to volunteer, or are looking to fund community sport — there is a place for you in Unami Sports.'),
      cardList('ways', 'Ways to Get Involved', [
        ['Partner FA', 'Bring your football association onto the Unami Sports platform.', '🏟️'],
        ['Volunteer', 'Support programme delivery, coaching, or administration.', '🙋'],
        ['Fund', 'Help us expand to more communities across South Africa.', '💛'],
        ['Spread the Word', 'Share what we are doing with your network.', '📢'],
      ]),
      callout('cta', 'Ready to take the next step?', 'Get in touch and we will find the right way for you to contribute.', [
        cta('Contact Us', '/contact'),
      ]),
    ],
  },

  // Contact /contact
  {
    _id: 'page.sports.contact',
    _type: 'page',
    title: 'Contact',
    metadata: slug('contact'),
    modules: [
      hero('hero', 'Say Hello', 'Contact Unami Sports', 'We would love to hear from you — whether you are a potential partner, funder, or just curious about what we do.'),
      prose('info', 'Email us at hello@unamifoundation.org or find us on social media. We aim to respond within 2 working days.'),
    ],
  },

  // 404
  {
    _id: 'page.not-found',
    _type: 'page',
    title: '404',
    metadata: slug('404'),
    modules: [
      callout('404', 'Page not found', 'The page you are looking for does not exist.', [
        cta('Go Home', '/'),
      ]),
    ],
  },

  // ── UNAMI STARS PAGES ─────────────────────────────────────────────────────

  // Stars Home /stars
  {
    _id: 'page.stars.home',
    _type: 'page',
    title: 'Unami Stars',
    metadata: slug('stars'),
    modules: [
      heroCover('hero', 'Unami Stars FC', 'Community Football. Real Results.', 'Follow Unami Stars — fixtures, results, players, and competitions. Powered by Unami Sports.', [
        cta('View Fixtures', '/stars/fixtures'),
        cta('Meet the Team', '/stars/teams'),
      ]),
      statList('stats', [
        ['6', 'Players'],
        ['3', 'Fixtures'],
        ['1', 'Competition'],
        ['2026', 'Season'],
      ]),
      featureBar('features', [
        ['📅', 'Live Fixtures', 'Up-to-date match schedule with results and standings.'],
        ['👥', 'Player Profiles', 'Every registered player with position and stats.'],
        ['🏆', 'Competitions', 'League and cup competitions tracked in real time.'],
        ['📍', 'Events', 'Community events, training days, and match days.'],
      ]),
    ],
  },

  // Stars Teams /stars/teams
  {
    _id: 'page.stars.teams',
    _type: 'page',
    title: 'Teams',
    metadata: slug('stars/teams'),
    modules: [
      hero('hero', 'Unami Stars FC', 'The Team', 'Meet the squad registered for the 2026 season under Kwagucingo FA.'),
      cardList('squad', 'The Squad', [
        ['Goalkeeper', 'Sipho Dlamini · #1 · GK', '🧤'],
        ['Defender', 'Thabo Nkosi · #4 · CB', '🛡️'],
        ['Defender', 'Lungelo Zulu · #2 · RB', '🛡️'],
        ['Midfielder', 'Mpho Sithole · #8 · CM', '⚙️'],
        ['Forward', 'Bongani Mokoena · #9 · ST', '⚽'],
        ['Forward', 'Siyanda Khumalo · #11 · LW', '⚡'],
      ]),
    ],
  },

  // Stars Players /stars/players
  {
    _id: 'page.stars.players',
    _type: 'page',
    title: 'Players',
    metadata: slug('stars/players'),
    modules: [
      hero('hero', 'The Squad', 'Player Profiles', 'All registered players for Unami Stars FC — 2026 season.'),
      cardList('players', 'Registered Players', [
        ['Sipho Dlamini', 'Goalkeeper · #1 · DOB: 2008-03-12 · Consent: ✅', '🧤'],
        ['Thabo Nkosi', 'Centre Back · #4 · DOB: 2007-07-22 · Consent: ✅', '🛡️'],
        ['Lungelo Zulu', 'Right Back · #2 · DOB: 2008-11-05 · Consent: ✅', '🛡️'],
        ['Mpho Sithole', 'Central Midfield · #8 · DOB: 2007-04-18 · Consent: ✅', '⚙️'],
        ['Bongani Mokoena', 'Striker · #9 · DOB: 2006-09-30 · Consent: ✅', '⚽'],
        ['Siyanda Khumalo', 'Left Wing · #11 · DOB: 2007-01-14 · Consent: ✅', '⚡'],
      ]),
    ],
  },

  // Stars Fixtures /stars/fixtures
  {
    _id: 'page.stars.fixtures',
    _type: 'page',
    title: 'Fixtures',
    metadata: slug('stars/fixtures'),
    modules: [
      hero('hero', '2026 Season', 'Fixtures & Results', 'All scheduled and completed matches for Unami Stars FC.'),
      cardList('results', 'Completed Fixtures', [
        ['Unami Stars 2–1 Riverside FC', 'Friendly · 15 Oct 2026 · Kwagucingo Ground · W', '✅'],
        ['Unami Stars 1–1 Valley United', 'Friendly · 8 Nov 2026 · Away · D', '🟡'],
        ['Community Day Match', 'Community Day · 20 Dec 2026 · TBC', '📅'],
      ]),
      statList('form', [
        ['2', 'Played'],
        ['1', 'Won'],
        ['1', 'Drawn'],
        ['0', 'Lost'],
        ['3', 'Goals For'],
        ['2', 'Goals Against'],
      ]),
    ],
  },

  // Stars Events /stars/events
  {
    _id: 'page.stars.events',
    _type: 'page',
    title: 'Events',
    metadata: slug('stars/events'),
    modules: [
      hero('hero', 'What\'s On', 'Events', 'Community events, match days, and training sessions for Unami Stars.'),
      cardList('events', 'Upcoming Events', [
        ['Community Day 2026', '20 December 2026 · Kwagucingo Ground · All welcome', '🎉'],
        ['Pre-Season Training', 'January 2027 · Dates TBC · Open to all registered players', '🏃'],
      ]),
    ],
  },

  // Stars Competitions /stars/competitions
  {
    _id: 'page.stars.competitions',
    _type: 'page',
    title: 'Competitions',
    metadata: slug('stars/competitions'),
    modules: [
      hero('hero', '2026 Season', 'Competitions', 'Leagues and cups that Unami Stars FC are registered in.'),
      cardList('comps', 'Active Competitions', [
        ['Kwagucingo Community League', '2026 Season · U19 · Organised by Kwagucingo FA', '🏆'],
      ]),
      statList('standing', [
        ['1st', 'League Position'],
        ['2', 'Played'],
        ['4', 'Points'],
        ['3', 'Goals For'],
      ]),
    ],
  },

  // ── SPORTS DATA ───────────────────────────────────────────────────────────

  // Team
  {
    _id: 'stars.team.unami-stars',
    _type: 'sports-team',
    name: 'Unami Stars FC',
    slug: rawSlug('unami-stars'),
    founded: 2026,
    homeGround: 'Kwagucingo Ground',
    publicProfile: true,
  },

  // Players
  ...['Sipho Dlamini','Thabo Nkosi','Lungelo Zulu','Mpho Sithole','Bongani Mokoena','Siyanda Khumalo'].map((name,i) => ({
    _id: `stars.player.p00${i+1}`,
    _type: 'sports-player',
    name,
    jerseyNumber: [1,4,2,8,9,11][i],
    position: ['Goalkeeper','Centre Back','Right Back','Central Midfield','Striker','Left Wing'][i],
    team: ref('stars.team.unami-stars'),
    consentOnFile: true,
  })),

  // Fixtures
  {
    _id: 'stars.fixture.oct-friendly',
    _type: 'sports-fixture',
    title: 'Unami Stars vs Riverside FC',
    date: '2026-10-15',
    homeTeam: ref('stars.team.unami-stars'),
    venue: 'Kwagucingo Ground',
    homeScore: 2, awayScore: 1,
    status: 'completed',
  },
  {
    _id: 'stars.fixture.nov-friendly',
    _type: 'sports-fixture',
    title: 'Valley United vs Unami Stars',
    date: '2026-11-08',
    awayTeam: ref('stars.team.unami-stars'),
    venue: 'Valley Ground',
    homeScore: 1, awayScore: 1,
    status: 'completed',
  },
  {
    _id: 'stars.fixture.community-day',
    _type: 'sports-fixture',
    title: 'Community Day Match',
    date: '2026-12-20',
    homeTeam: ref('stars.team.unami-stars'),
    venue: 'Kwagucingo Ground',
    status: 'scheduled',
  },

  // Competition
  {
    _id: 'stars.competition.kwagucingo-league',
    _type: 'sports-competition',
    name: 'Kwagucingo Community League',
    season: '2026',
    ageGroup: 'U19',
    organiser: 'Kwagucingo FA',
  },

  // Event
  {
    _id: 'stars.event.community-day',
    _type: 'sports-event',
    title: 'Community Day 2026',
    date: '2026-12-20',
    venue: 'Kwagucingo Ground',
    description: 'Annual community day with football, food, and celebration.',
    public: true,
  },

  // Stakeholder
  {
    _id: 'stars.stakeholder.kwagucingo-fa',
    _type: 'sports-stakeholder',
    name: 'Kwagucingo FA',
    role: 'Partner Football Association',
    contactEmail: 'admin@kwagucingofa.org',
  },

  // Pilot
  {
    _id: 'stars.pilot.unami-stars-2026',
    _type: 'sports-pilot',
    name: 'Unami Stars Pilot 2026',
    status: 'active',
    launchDate: '2026-01-01',
    team: ref('stars.team.unami-stars'),
    stakeholder: ref('stars.stakeholder.kwagucingo-fa'),
  },

]

// ─── Run ──────────────────────────────────────────────────────────────────────
async function run() {
  console.log(`Seeding ${docs.length} documents...`)
  const tx = client.transaction()
  docs.forEach(doc => tx.createOrReplace(doc))
  const result = await tx.commit()
  console.log(`✅ Done — ${result.results.length} docs created`)
}

run().catch(e => { console.error(e.message); process.exit(1) })
