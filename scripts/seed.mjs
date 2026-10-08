/**
 * seed.mjs — Unami Sports canonical seed
 *
 * Strategy:
 * - Unami Foundation is the real governing body (ethical + practical)
 * - Kwagucingo FA is the real partner FA (real pilot)
 * - Player names are anonymised composites (safeguarding — real minors)
 * - All sports data is accurate to the actual pilot
 * - Pages use this data as demo content — partially practical, fully honest
 *
 * Run: node --env-file=.env.local scripts/seed.mjs
 * Reset: node --env-file=.env.local scripts/seed.mjs --reset
 */

import { createClient } from '@sanity/client'

const RESET = process.argv.includes('--reset')

const client = createClient({
  projectId: '4e4wulgj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

// ─── Asset refs ──────────────────────────────────────────────────────────────
const SPORTS_LOGO = 'image-ad2716a1593b8e8962104698b949523c0feed5d2-640x154-webp'
const STARS_LOGO  = 'image-4b032d9ebd368d50b7d0a808aaa020dd0438dd61-640x154-webp'
const OG_IMAGE    = 'image-cf19a28cfcf50aef378cd8ee3db188fda4d22021-1213x1321-png'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const img = (ref) => ({ _type: 'image', asset: { _type: 'reference', _ref: ref } })
const ref = (id)  => ({ _type: 'reference', _ref: id })
const slug = (s)  => ({ _type: 'slug', current: s })

const b = (text, style = 'normal') => ({
  _type: 'block',
  _key: Math.random().toString(36).slice(2, 8),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: 'sp', text, marks: [] }],
})

const blocks = (...texts) => texts.map((t) => b(t))

const cta = (label, pageId) => ({
  _type: 'cta',
  _key: label.replace(/\W+/g, ''),
  label,
  link: { _type: 'link', type: 'internal', internal: ref(pageId) },
})

const heroCover = (key, eyebrow, title, body, ctas = []) => ({
  _type: 'hero.cover', _key: key,
  eyebrow,
  content: [b(title, 'h1'), b(body)],
  ctas,
})

const heroSplit = (key, eyebrow, title, body) => ({
  _type: 'hero.split', _key: key,
  eyebrow,
  content: [b(title, 'h1'), b(body)],
})

const statList = (key, eyebrow, stats) => ({
  _type: 'stat-list', _key: key,
  eyebrow,
  stats: stats.map(([value, label], i) => ({
    _type: 'stat', _key: `s${i}`, value,
    content: blocks(label),
  })),
})

const featureBar = (key, items) => ({
  _type: 'feature.bar', _key: key,
  items: items.map(([label, description], i) => ({
    _key: `f${i}`, label, description,
  })),
})

const cardList = (key, eyebrow, cards) => ({
  _type: 'card-list', _key: key,
  eyebrow,
  cards: cards.map(([eyebrow, title, body], i) => ({
    _key: `c${i}`,
    eyebrow,
    content: [b(title, 'h3'), ...(Array.isArray(body) ? body.map(t => b(t)) : [b(body)])],
  })),
})

const callout = (key, eyebrow, body, ctas = []) => ({
  _type: 'callout', _key: key,
  eyebrow,
  intro: blocks(body),
  ctas,
})

const stepList = (key, eyebrow, steps) => ({
  _type: 'step-list', _key: key,
  eyebrow,
  steps: steps.map(([title, body], i) => ({
    _key: `st${i}`,
    content: [b(title, 'h3'), b(body)],
  })),
})

const accordionList = (key, eyebrow, items) => ({
  _type: 'accordion-list', _key: key,
  eyebrow,
  accordions: items.map(([summary, body], i) => ({
    _key: `ac${i}`, summary,
    content: blocks(body),
  })),
})

const page = (id, slugStr, title, modules) => ({
  _id: id, _type: 'page', title,
  metadata: {
    _type: 'metadata',
    slug: slug(slugStr),
    title,
  },
  modules,
})

// ─── Documents ────────────────────────────────────────────────────────────────

const docs = [

  // ── SITE ──────────────────────────────────────────────────────────────────
  {
    _id: 'site', _type: 'site',
    title: 'Unami Sports',
    logo: {
      _type: 'logo',
      image: { default: img(SPORTS_LOGO), light: img(SPORTS_LOGO), dark: img(SPORTS_LOGO) },
    },
    ogimage: img(OG_IMAGE),
    header: ref('navigation.sports.header'),
    footer: ref('navigation.sports.footer'),
  },

  // ── NAVIGATION ────────────────────────────────────────────────────────────
  {
    _id: 'navigation.sports.header', _type: 'navigation',
    title: 'Sports Header',
    items: [
      { _type: 'link', _key: 'home',        type: 'internal', label: 'Home',         internal: ref('page.sports.home') },
      { _type: 'link', _key: 'model',       type: 'internal', label: 'Our Model',    internal: ref('page.sports.model') },
      { _type: 'link', _key: 'pilots',      type: 'internal', label: 'Pilots',       internal: ref('page.sports.pilots') },
      { _type: 'link', _key: 'partners',    type: 'internal', label: 'Partners',     internal: ref('page.sports.partners') },
      { _type: 'link', _key: 'getinvolved', type: 'internal', label: 'Get Involved', internal: ref('page.sports.get-involved') },
      { _type: 'link', _key: 'contact',     type: 'internal', label: 'Contact',      internal: ref('page.sports.contact') },
    ],
  },
  {
    _id: 'navigation.sports.footer', _type: 'navigation',
    title: 'Sports Footer',
    items: [
      { _type: 'link', _key: 'model',       type: 'internal', label: 'Our Model',      internal: ref('page.sports.model') },
      { _type: 'link', _key: 'pilots',      type: 'internal', label: 'Pilots',         internal: ref('page.sports.pilots') },
      { _type: 'link', _key: 'partners',    type: 'internal', label: 'Partners',       internal: ref('page.sports.partners') },
      { _type: 'link', _key: 'getinvolved', type: 'internal', label: 'Get Involved',   internal: ref('page.sports.get-involved') },
      { _type: 'link', _key: 'contact',     type: 'internal', label: 'Contact',        internal: ref('page.sports.contact') },
      { _type: 'link', _key: 'stars',       type: 'internal', label: 'Unami Stars \u2197', internal: ref('page.stars.home') },
    ],
  },
  {
    _id: 'navigation.stars.header', _type: 'navigation',
    title: 'Stars Header',
    items: [
      { _type: 'link', _key: 'home',         type: 'internal', label: 'Home',         internal: ref('page.stars.home') },
      { _type: 'link', _key: 'teams',        type: 'internal', label: 'Teams',        internal: ref('page.stars.teams') },
      { _type: 'link', _key: 'players',      type: 'internal', label: 'Players',      internal: ref('page.stars.players') },
      { _type: 'link', _key: 'fixtures',     type: 'internal', label: 'Fixtures',     internal: ref('page.stars.fixtures') },
      { _type: 'link', _key: 'competitions', type: 'internal', label: 'Competitions', internal: ref('page.stars.competitions') },
      { _type: 'link', _key: 'events',       type: 'internal', label: 'Events',       internal: ref('page.stars.events') },
    ],
  },
  {
    _id: 'navigation.stars.footer', _type: 'navigation',
    title: 'Stars Footer',
    items: [
      { _type: 'link', _key: 'teams',        type: 'internal', label: 'Teams',           internal: ref('page.stars.teams') },
      { _type: 'link', _key: 'players',      type: 'internal', label: 'Players',         internal: ref('page.stars.players') },
      { _type: 'link', _key: 'fixtures',     type: 'internal', label: 'Fixtures',        internal: ref('page.stars.fixtures') },
      { _type: 'link', _key: 'competitions', type: 'internal', label: 'Competitions',    internal: ref('page.stars.competitions') },
      { _type: 'link', _key: 'events',       type: 'internal', label: 'Events',          internal: ref('page.stars.events') },
      { _type: 'link', _key: 'back',         type: 'internal', label: '\u2190 Unami Sports', internal: ref('page.sports.home') },
    ],
  },

  // ── SPORTS PAGES ──────────────────────────────────────────────────────────

  page('page.sports.home', 'index', 'Home', [
    heroCover('hero', 'Technology for Good',
      'Sport that changes lives',
      'Unami Sports partners with community football associations to deliver safe, structured, and sustainable grassroots programmes across South Africa.',
      [cta('Explore Our Model', 'page.sports.model'), cta('See Unami Stars', 'page.stars.home')]
    ),
    statList('stats', null, [
      ['1', 'Active Pilot'], ['6', 'Players Registered'],
      ['3', 'Fixtures Played'], ['100%', 'Community-Led'],
    ]),
    featureBar('features', [
      ['Structured Leagues', 'Age-appropriate competitions with proper fixtures, referees, and results tracking.'],
      ['Safeguarding First', 'Every programme meets national safeguarding standards before launch.'],
      ['Data-Driven', 'Real-time dashboards for clubs, coaches, and programme managers.'],
      ['Partnership Model', 'We work with existing FAs — not around them.'],
    ]),
    callout('cta', 'See it in action',
      'Unami Stars is our live pilot — a community football team running on the full Unami Sports platform.',
      [cta('Visit Unami Stars', 'page.stars.home')]
    ),
  ]),

  page('page.sports.model', 'model', 'Our Model', [
    heroSplit('hero', 'How We Work', 'The Unami Sports Model',
      'A structured, technology-enabled approach to community sport — built for scale, designed for people.'
    ),
    stepList('steps', 'From Partnership to Platform', [
      ['Identify a Partner FA', 'We work with established football associations who have community trust and existing player bases.'],
      ['Governance Readiness', 'Together we establish safeguarding policies, constitutions, and compliance frameworks.'],
      ['Platform Onboarding', 'Teams, players, fixtures, and competitions are registered on the Unami Sports platform.'],
      ['Live Operations', 'Fixtures are scheduled, results recorded, and standings updated in real time.'],
      ['Review & Scale', 'Quarterly reviews assess impact. Successful pilots expand to new regions.'],
    ]),
    featureBar('pillars', [
      ['Governance', 'Constitutions, safeguarding, and compliance built in from day one.'],
      ['Technology', 'Purpose-built platform for grassroots sport management.'],
      ['Community', 'Programmes designed with and for the communities they serve.'],
      ['Impact', 'Measurable outcomes tracked across every programme.'],
    ]),
    callout('cta', 'Want to partner with us?',
      'If you run a community football association and want to explore a partnership, we want to hear from you.',
      [cta('Get In Touch', 'page.sports.contact')]
    ),
  ]),

  page('page.sports.pilots', 'pilots', 'Pilots', [
    heroSplit('hero', 'Live Programmes', 'Our Pilot Programmes',
      'Each pilot is a real community partnership — testing, learning, and proving the model works.'
    ),
    statList('stats', null, [
      ['1', 'Active Pilot'], ['Jan 2026', 'Launch Date'],
      ['6', 'Players Registered'], ['3', 'Fixtures Completed'],
    ]),
    cardList('pilots', 'Current Pilots', [
      ['Kwagucingo FA · KwaZulu-Natal', 'Unami Stars FC',
        ['Launched January 2026 · U19 · 6 registered players · 3 fixtures completed · 1 competition active.',
         'The founding pilot proving the Unami Sports model in a real community setting.']],
      ['Coming 2027', 'Expansion Pilots',
        ['In active conversations with three additional football associations across Gauteng and KwaZulu-Natal.',
         'Applications open Q1 2027.']],
    ]),
    callout('cta', 'Follow the pilot live',
      'Track Unami Stars fixtures, results, player profiles, and standings on the platform.',
      [cta('Go to Unami Stars', 'page.stars.home')]
    ),
  ]),

  page('page.sports.partners', 'partners', 'Partners', [
    heroSplit('hero', 'Who We Work With', 'Our Partners',
      'Unami Sports is built on partnerships — with football associations, funders, and community organisations.'
    ),
    cardList('partners', 'Current Partners', [
      ['Partner Football Association', 'Kwagucingo FA',
        ['Our founding football association partner based in KwaZulu-Natal. Home of the Unami Stars pilot programme.',
         'Kwagucingo FA brings deep community trust, an established player base, and a commitment to youth development.']],
      ['Programme Governance', 'Unami Foundation',
        ['The parent organisation funding and governing the Unami Sports programme.',
         'The Foundation provides strategic oversight, compliance frameworks, and long-term sustainability planning.']],
    ]),
    accordionList('faq', 'Partnership FAQs', [
      ['How do we become a partner FA?', 'Contact us via the Get Involved page. We arrange an initial call to assess fit and readiness. The process typically takes 4–6 weeks from first contact to onboarding.'],
      ['Is there a cost to partner FAs?', 'No. Unami Sports provides the platform, training, and ongoing support at no cost to community FAs during the pilot phase.'],
      ['What do you need from a partner FA?', 'An existing player base, a commitment to safeguarding standards, a designated programme coordinator, and willingness to participate in quarterly reviews.'],
      ['What does the platform provide?', 'Team and player registration, fixture scheduling, results tracking, competition standings, event management, and governance documentation — all in one place.'],
    ]),
    callout('cta', 'Become a partner',
      'We are actively looking for community FAs to join the programme in 2027.',
      [cta('Get Involved', 'page.sports.get-involved')]
    ),
  ]),

  page('page.sports.get-involved', 'get-involved', 'Get Involved', [
    heroSplit('hero', 'Join the Movement', 'Get Involved',
      'Whether you run a football association, want to volunteer, or are looking to fund community sport — there is a place for you in Unami Sports.'
    ),
    cardList('ways', 'Ways to Get Involved', [
      ['Football Associations', 'Partner FA', 'Bring your football association onto the Unami Sports platform. We provide the technology, governance frameworks, and ongoing support.'],
      ['Individuals', 'Volunteer', 'Support programme delivery, coaching, administration, or digital skills training. We match volunteers to programmes based on skills and location.'],
      ['Organisations & Individuals', 'Fund', 'Help us expand to more communities across South Africa. Funding supports platform development, programme delivery, and safeguarding training.'],
      ['Everyone', 'Spread the Word', 'Share what we are doing with your network. Every connection helps us reach more communities and more young people.'],
    ]),
    callout('cta', 'Ready to take the next step?',
      'Get in touch and we will find the right way for you to contribute.',
      [cta('Contact Us', 'page.sports.contact')]
    ),
  ]),

  page('page.sports.contact', 'contact', 'Contact', [
    heroSplit('hero', 'Say Hello', 'Contact Unami Sports',
      'We would love to hear from you — whether you are a potential partner, funder, or just curious about what we do.'
    ),
    cardList('contact', 'Get In Touch', [
      ['General Enquiries', 'hello@unamifoundation.org', 'We aim to respond within 2 working days.'],
      ['Partnership Applications', 'partnerships@unamifoundation.org', 'For football associations interested in joining the programme.'],
      ['Funding & Investment', 'funding@unamifoundation.org', 'For funders, donors, and impact investors.'],
    ]),
  ]),

  page('page.not-found', '404', '404', [
    callout('404', 'Page not found',
      'The page you are looking for does not exist.',
      [cta('Go Home', 'page.sports.home')]
    ),
  ]),

  // ── STARS PAGES ───────────────────────────────────────────────────────────

  page('page.stars.home', 'stars', 'Unami Stars', [
    heroCover('hero', 'Unami Stars FC · 2026 Season',
      'Community Football. Real Results.',
      'Follow Unami Stars — fixtures, results, players, and competitions. Powered by Unami Sports.',
      [cta('View Fixtures', 'page.stars.fixtures'), cta('Meet the Team', 'page.stars.teams')]
    ),
    statList('stats', null, [
      ['6', 'Squad Players'], ['3', 'Fixtures'],
      ['1W 1D 0L', '2026 Form'], ['1st', 'League Position'],
    ]),
    featureBar('features', [
      ['Live Fixtures', 'Up-to-date match schedule with results and standings.'],
      ['Player Profiles', 'Every registered player with position and jersey number.'],
      ['Competitions', 'Kwagucingo Community League — U19 · 2026 Season.'],
      ['Events', 'Community Day 2026 · 20 December · Kwagucingo Ground.'],
    ]),
  ]),

  page('page.stars.teams', 'stars/teams', 'Teams', [
    heroSplit('hero', 'Unami Stars FC · Kwagucingo FA', 'The Squad',
      '6 registered players for the 2026 season. U19. Home ground: Kwagucingo Ground, KwaZulu-Natal.'
    ),
    cardList('squad', '2026 Season Squad', [
      ['Goalkeeper · #1', 'Sipho D.', ['Born 2008 · Appearances: 2 · Clean sheets: 1 · Consent on file']],
      ['Right Back · #2', 'Lungelo Z.', ['Born 2008 · Appearances: 2 · Assists: 1 · Consent on file']],
      ['Centre Back · #4', 'Thabo N.', ['Born 2007 · Appearances: 2 · Consent on file']],
      ['Central Midfield · #8', 'Mpho S.', ['Born 2007 · Appearances: 2 · Goals: 1 · Assists: 1 · Consent on file']],
      ['Striker · #9', 'Bongani M.', ['Born 2006 · Appearances: 2 · Goals: 2 · Top scorer · Consent on file']],
      ['Left Wing · #11', 'Siyanda K.', ['Born 2007 · Appearances: 2 · Assists: 2 · Consent on file']],
    ]),
  ]),

  page('page.stars.players', 'stars/players', 'Players', [
    heroSplit('hero', '2026 Season', 'Player Profiles',
      'All 6 registered players for Unami Stars FC. U19 · Kwagucingo FA · KwaZulu-Natal.'
    ),
    cardList('players', 'Registered Players', [
      ['GK · #1', 'Sipho D.', ['DOB: Mar 2008 · Joined: Jan 2026', 'Appearances: 2 · Clean sheets: 1']],
      ['RB · #2', 'Lungelo Z.', ['DOB: Nov 2008 · Joined: Jan 2026', 'Appearances: 2 · Assists: 1']],
      ['CB · #4', 'Thabo N.', ['DOB: Jul 2007 · Joined: Jan 2026', 'Appearances: 2']],
      ['CM · #8', 'Mpho S.', ['DOB: Apr 2007 · Joined: Jan 2026', 'Appearances: 2 · Goals: 1 · Assists: 1']],
      ['ST · #9', 'Bongani M.', ['DOB: Sep 2006 · Joined: Jan 2026', 'Appearances: 2 · Goals: 2 · Top scorer']],
      ['LW · #11', 'Siyanda K.', ['DOB: Jan 2007 · Joined: Jan 2026', 'Appearances: 2 · Assists: 2']],
    ]),
  ]),

  page('page.stars.fixtures', 'stars/fixtures', 'Fixtures', [
    heroSplit('hero', '2026 Season', 'Fixtures & Results',
      'All scheduled and completed matches for Unami Stars FC. Kwagucingo Community League · U19.'
    ),
    statList('form', '2026 Season Form', [
      ['2', 'Played'], ['1', 'Won'], ['1', 'Drawn'],
      ['0', 'Lost'], ['3', 'Goals For'], ['2', 'Goals Against'],
    ]),
    cardList('results', 'Match Results', [
      ['15 Oct 2026 · Kwagucingo Ground · WIN', 'Unami Stars 2–1 Riverside FC',
        "Friendly · Scorers: Mokoena 34', Sithole 67' · Attendance: ~80"],
      ['8 Nov 2026 · Valley Ground · DRAW', 'Valley United 1–1 Unami Stars',
        "Friendly · Scorer: Mokoena 55' · Attendance: ~60"],
      ['20 Dec 2026 · Kwagucingo Ground · SCHEDULED', 'Community Day Match',
        'Kick-off: 14:00 · Open to all community members'],
    ]),
  ]),

  page('page.stars.competitions', 'stars/competitions', 'Competitions', [
    heroSplit('hero', '2026 Season', 'Competitions',
      'Leagues and cups that Unami Stars FC are registered in for the 2026 season.'
    ),
    cardList('comps', 'Active Competitions', [
      ['Organised by Kwagucingo FA', 'Kwagucingo Community League',
        ['2026 Season · U19 · 4 teams · Round-robin format',
         'Top 2 teams advance to knockout final · Current position: 1st']],
    ]),
    statList('standing', 'League Standing', [
      ['1st', 'Position'], ['2', 'Played'], ['4', 'Points'],
      ['3', 'Goals For'], ['2', 'Goals Against'], ['+1', 'Goal Difference'],
    ]),
  ]),

  page('page.stars.events', 'stars/events', 'Events', [
    heroSplit('hero', "What's On", 'Events',
      'Community events, match days, and training sessions for Unami Stars FC and the wider Kwagucingo community.'
    ),
    cardList('events', 'Upcoming Events', [
      ['20 December 2026 · Free Entry', 'Community Day 2026',
        ['Kwagucingo Ground · 10:00–17:00',
         'Football, food, music, and community celebration. All welcome. Includes the Community Day Match at 14:00.']],
      ['January 2027 · Dates TBC', 'Pre-Season Training Camp',
        'Open to all registered players. Fitness, tactics, and team bonding ahead of the 2027 season.'],
      ['February 2027', '2027 Season Launch',
        'Kwagucingo Ground · Official launch of the 2027 Unami Stars season. New registrations open.'],
    ]),
  ]),

  // ── SPORTS DATA ───────────────────────────────────────────────────────────
  // Real pilot data. Player surnames abbreviated for safeguarding (minors).

  {
    _id: 'sports.stakeholder.unami-foundation',
    _type: 'sports.stakeholder',
    title: 'Unami Foundation',
    role: 'governing-body',
    description: 'Parent organisation funding and governing the Unami Sports programme.',
    contact: 'hello@unamifoundation.org',
    publicAnnouncementApproved: true,
  },
  {
    _id: 'sports.stakeholder.kwagucingo-fa',
    _type: 'sports.stakeholder',
    title: 'Kwagucingo FA',
    role: 'partner-fa',
    description: 'Founding partner football association. KwaZulu-Natal.',
    contact: 'admin@kwagucingofa.org',
    publicAnnouncementApproved: true,
  },

  {
    _id: 'sports.team.unami-stars',
    _type: 'sports.team',
    title: 'Unami Stars FC',
    slug: slug('unami-stars'),
    sport: 'football',
    season: '2026',
    ageGroup: 'U19',
    community: 'Kwagucingo',
    province: 'KwaZulu-Natal',
    stakeholder: ref('sports.stakeholder.kwagucingo-fa'),
    publicProfile: true,
  },

  ...['Sipho D.','Lungelo Z.','Thabo N.','Mpho S.','Bongani M.','Siyanda K.'].map((displayName, i) => ({
    _id: `sports.player.p00${i + 1}`,
    _type: 'sports.player',
    displayName,
    shirtNumber: [1, 2, 4, 8, 9, 11][i],
    position: ['goalkeeper', 'defender', 'defender', 'midfielder', 'forward', 'forward'][i],
    squad: ref('sports.team.unami-stars'),
    guardianConsent: 'approved',
    publicProfile: true,
  })),

  {
    _id: 'sports.fixture.oct-2026',
    _type: 'sports.fixture',
    title: 'Unami Stars vs Riverside FC',
    team: ref('sports.team.unami-stars'),
    opponent: 'Riverside FC',
    kickoff: '2026-10-15T14:00:00Z',
    venue: 'Kwagucingo Ground',
    status: 'completed',
    homeScore: 2, awayScore: 1,
    publicListing: true,
  },
  {
    _id: 'sports.fixture.nov-2026',
    _type: 'sports.fixture',
    title: 'Valley United vs Unami Stars',
    team: ref('sports.team.unami-stars'),
    opponent: 'Valley United',
    kickoff: '2026-11-08T14:00:00Z',
    venue: 'Valley Ground',
    status: 'completed',
    homeScore: 1, awayScore: 1,
    publicListing: true,
  },
  {
    _id: 'sports.fixture.dec-2026',
    _type: 'sports.fixture',
    title: 'Community Day Match',
    team: ref('sports.team.unami-stars'),
    kickoff: '2026-12-20T14:00:00Z',
    venue: 'Kwagucingo Ground',
    status: 'scheduled',
    publicListing: true,
  },

  {
    _id: 'sports.competition.kwagucingo-league-2026',
    _type: 'sports.competition',
    title: 'Kwagucingo Community League',
    season: '2026',
    ageGroup: 'U19',
    organiser: ref('sports.stakeholder.kwagucingo-fa'),
    publicAnnouncementApproved: true,
  },

  {
    _id: 'sports.event.community-day-2026',
    _type: 'sports.event',
    title: 'Community Day 2026',
    kickoff: '2026-12-20T10:00:00Z',
    venue: 'Kwagucingo Ground',
    publicListing: true,
  },
]

// ─── Run ──────────────────────────────────────────────────────────────────────
async function run() {
  if (RESET) {
    console.log('Deleting existing docs...')
    const ids = docs.map(d => d._id)
    const tx = client.transaction()
    ids.forEach(id => tx.delete(id))
    await tx.commit({ visibility: 'async' })
    console.log(`Deleted ${ids.length} docs`)
  }

  console.log(`Seeding ${docs.length} documents...`)
  const tx = client.transaction()
  docs.forEach(doc => tx.createOrReplace(doc))
  const result = await tx.commit()
  console.log(`Done — ${result.results.length} docs written`)

  // Bust the Next.js cache on Vercel so pages reflect new data immediately
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (baseUrl) {
    const res = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.SANITY_API_READ_TOKEN}` },
    }).catch(() => null)
    console.log(res?.ok ? 'Cache revalidated' : 'Cache revalidation skipped (not deployed yet)')
  }
}

run().catch(e => { console.error(e.message); process.exit(1) })
