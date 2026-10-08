/**
 * seed-content-v2.mjs
 * Uses exact field names from SanityPress module schemas.
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

// PortableText block helper
const b = (text, style = 'normal') => ({
	_type: 'block',
	_key: Math.random().toString(36).slice(2, 8),
	style,
	markDefs: [],
	children: [{ _type: 'span', _key: 'sp', text, marks: [] }],
})

const blocks = (...texts) => texts.map((t) => b(t))

// CTA with internal page ref
const cta = (label, pageId) => ({
	_type: 'cta',
	_key: label.replace(/\W+/g, ''),
	label,
	link: { _type: 'link', type: 'internal', internal: ref(pageId) },
})

const pages = [

	// ── HOME /index ───────────────────────────────────────────────────────────
	{
		_id: 'page.sports.home',
		modules: [
			{
				_type: 'hero.cover', _key: 'hero',
				eyebrow: 'Technology for Good',
				content: [
					b('Sport that changes lives', 'h1'),
					b('Unami Sports partners with community football associations to deliver safe, structured, and sustainable grassroots programmes across South Africa.'),
				],
				ctas: [
					cta('Explore Our Model', 'page.sports.model'),
					cta('See Unami Stars', 'page.stars.home'),
				],
			},
			{
				_type: 'stat-list', _key: 'stats',
				stats: [
					{ _type: 'stat', _key: 's0', value: '1', content: blocks('Active Pilot') },
					{ _type: 'stat', _key: 's1', value: '6', content: blocks('Registered Players') },
					{ _type: 'stat', _key: 's2', value: '3', content: blocks('Fixtures Played') },
					{ _type: 'stat', _key: 's3', value: '100%', content: blocks('Community-Led') },
				],
			},
			{
				_type: 'feature.bar', _key: 'features',
				items: [
					{ _key: 'f0', label: 'Structured Leagues', description: 'Age-appropriate competitions with proper fixtures, referees, and results tracking.' },
					{ _key: 'f1', label: 'Safeguarding First', description: 'Every programme meets national safeguarding standards before launch.' },
					{ _key: 'f2', label: 'Data-Driven', description: 'Real-time dashboards for clubs, coaches, and programme managers.' },
					{ _key: 'f3', label: 'Partnership Model', description: 'We work with existing FAs — not around them.' },
				],
			},
			{
				_type: 'callout', _key: 'cta-stars',
				eyebrow: 'See it in action',
				intro: blocks('Unami Stars is our live pilot — a community football team running on the full Unami Sports platform.'),
				ctas: [cta('Visit Unami Stars', 'page.stars.home')],
			},
		],
	},

	// ── OUR MODEL /model ──────────────────────────────────────────────────────
	{
		_id: 'page.sports.model',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				eyebrow: 'How We Work',
				content: [
					b('The Unami Sports Model', 'h1'),
					b('A structured, technology-enabled approach to community sport — built for scale, designed for people.'),
				],
			},
			{
				_type: 'step-list', _key: 'steps',
				eyebrow: 'From Partnership to Platform',
				intro: blocks('Five stages from first contact to live operations.'),
				steps: [
					{ _key: 'st0', content: [b('Identify a Partner FA', 'h3'), b('We work with established football associations who have community trust and existing player bases.')] },
					{ _key: 'st1', content: [b('Governance Readiness', 'h3'), b('Together we establish safeguarding policies, constitutions, and compliance frameworks.')] },
					{ _key: 'st2', content: [b('Platform Onboarding', 'h3'), b('Teams, players, fixtures, and competitions are registered on the Unami Sports platform.')] },
					{ _key: 'st3', content: [b('Live Operations', 'h3'), b('Fixtures are scheduled, results recorded, and standings updated in real time.')] },
					{ _key: 'st4', content: [b('Review & Scale', 'h3'), b('Quarterly reviews assess impact. Successful pilots expand to new regions.')] },
				],
			},
			{
				_type: 'feature.bar', _key: 'pillars',
				items: [
					{ _key: 'f0', label: 'Governance', description: 'Constitutions, safeguarding, and compliance built in from day one.' },
					{ _key: 'f1', label: 'Technology', description: 'Purpose-built platform for grassroots sport management.' },
					{ _key: 'f2', label: 'Community', description: 'Programmes designed with and for the communities they serve.' },
					{ _key: 'f3', label: 'Impact', description: 'Measurable outcomes tracked across every programme.' },
				],
			},
			{
				_type: 'callout', _key: 'cta',
				eyebrow: 'Want to partner with us?',
				intro: blocks('If you run a community football association and want to explore a partnership, we want to hear from you.'),
				ctas: [cta('Get In Touch', 'page.sports.contact')],
			},
		],
	},

	// ── PILOTS /pilots ────────────────────────────────────────────────────────
	{
		_id: 'page.sports.pilots',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				eyebrow: 'Live Programmes',
				content: [
					b('Our Pilot Programmes', 'h1'),
					b('Each pilot is a real community partnership — testing, learning, and proving the model works.'),
				],
			},
			{
				_type: 'stat-list', _key: 'stats',
				stats: [
					{ _key: 's0', value: '1', content: blocks('Active Pilot') },
					{ _key: 's1', value: 'Jan 2026', content: blocks('Launch Date') },
					{ _key: 's2', value: '6', content: blocks('Players Registered') },
					{ _key: 's3', value: '3', content: blocks('Fixtures Completed') },
				],
			},
			{
				_type: 'card-list', _key: 'pilots',
				eyebrow: 'Current Pilots',
				cards: [
					{
						_key: 'c0',
						eyebrow: 'Kwagucingo FA · KwaZulu-Natal',
						content: [
							b('Unami Stars FC', 'h3'),
							b('Launched January 2026 · U19 · 6 registered players · 3 fixtures completed · 1 competition active.'),
							b('The founding pilot proving the Unami Sports model in a real community setting.'),
						],
						ctas: [cta('View Team', 'page.stars.teams')],
					},
					{
						_key: 'c1',
						eyebrow: 'Coming 2027',
						content: [
							b('Expansion Pilots', 'h3'),
							b('We are in active conversations with three additional football associations across Gauteng and KwaZulu-Natal.'),
							b('Applications open Q1 2027.'),
						],
					},
				],
			},
			{
				_type: 'callout', _key: 'cta',
				eyebrow: 'Follow the pilot live',
				intro: blocks('Track Unami Stars fixtures, results, player profiles, and standings on the platform.'),
				ctas: [cta('Go to Unami Stars', 'page.stars.home')],
			},
		],
	},

	// ── PARTNERS /partners ────────────────────────────────────────────────────
	{
		_id: 'page.sports.partners',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				eyebrow: 'Who We Work With',
				content: [
					b('Our Partners', 'h1'),
					b('Unami Sports is built on partnerships — with football associations, funders, and community organisations.'),
				],
			},
			{
				_type: 'card-list', _key: 'partners',
				eyebrow: 'Current Partners',
				cards: [
					{
						_key: 'c0',
						eyebrow: 'Partner Football Association',
						content: [
							b('Kwagucingo FA', 'h3'),
							b('Our founding football association partner based in KwaZulu-Natal. Home of the Unami Stars pilot programme.'),
							b('Kwagucingo FA brings deep community trust, an established player base, and a commitment to youth development.'),
						],
					},
					{
						_key: 'c1',
						eyebrow: 'Programme Governance',
						content: [
							b('Unami Foundation', 'h3'),
							b('The parent organisation funding and governing the Unami Sports programme.'),
							b('The Foundation provides strategic oversight, compliance frameworks, and long-term sustainability planning.'),
						],
					},
				],
			},
			{
				_type: 'accordion-list', _key: 'faq',
				eyebrow: 'Partnership FAQs',
				accordions: [
					{ _key: 'ac0', summary: 'How do we become a partner FA?', content: blocks('Contact us via the Get Involved page. We will arrange an initial call to assess fit and readiness. The process typically takes 4–6 weeks from first contact to onboarding.') },
					{ _key: 'ac1', summary: 'Is there a cost to partner FAs?', content: blocks('No. Unami Sports provides the platform, training, and ongoing support at no cost to community FAs during the pilot phase.') },
					{ _key: 'ac2', summary: 'What do you need from a partner FA?', content: blocks('An existing player base, a commitment to safeguarding standards, a designated programme coordinator, and willingness to participate in quarterly reviews.') },
					{ _key: 'ac3', summary: 'What does the platform provide?', content: blocks('Team and player registration, fixture scheduling, results tracking, competition standings, event management, and governance documentation — all in one place.') },
				],
			},
			{
				_type: 'callout', _key: 'cta',
				eyebrow: 'Become a partner',
				intro: blocks('We are actively looking for community FAs to join the programme in 2027.'),
				ctas: [cta('Get Involved', 'page.sports.get-involved')],
			},
		],
	},

	// ── GET INVOLVED /get-involved ────────────────────────────────────────────
	{
		_id: 'page.sports.get-involved',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				eyebrow: 'Join the Movement',
				content: [
					b('Get Involved', 'h1'),
					b('Whether you run a football association, want to volunteer, or are looking to fund community sport — there is a place for you in Unami Sports.'),
				],
			},
			{
				_type: 'card-list', _key: 'ways',
				eyebrow: 'Ways to Get Involved',
				cards: [
					{ _key: 'c0', eyebrow: 'Football Associations', content: [b('Partner FA', 'h3'), b('Bring your football association onto the Unami Sports platform. We provide the technology, governance frameworks, and ongoing support. You bring the community.')] },
					{ _key: 'c1', eyebrow: 'Individuals', content: [b('Volunteer', 'h3'), b('Support programme delivery, coaching, administration, or digital skills training. We match volunteers to programmes based on skills and location.')] },
					{ _key: 'c2', eyebrow: 'Organisations & Individuals', content: [b('Fund', 'h3'), b('Help us expand to more communities across South Africa. Funding supports platform development, programme delivery, and safeguarding training.')] },
					{ _key: 'c3', eyebrow: 'Everyone', content: [b('Spread the Word', 'h3'), b('Share what we are doing with your network. Every connection helps us reach more communities and more young people.')] },
				],
			},
			{
				_type: 'callout', _key: 'cta',
				eyebrow: 'Ready to take the next step?',
				intro: blocks('Get in touch and we will find the right way for you to contribute.'),
				ctas: [cta('Contact Us', 'page.sports.contact')],
			},
		],
	},

	// ── CONTACT /contact ──────────────────────────────────────────────────────
	{
		_id: 'page.sports.contact',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				eyebrow: 'Say Hello',
				content: [
					b('Contact Unami Sports', 'h1'),
					b('We would love to hear from you — whether you are a potential partner, funder, or just curious about what we do.'),
				],
			},
			{
				_type: 'card-list', _key: 'contact',
				eyebrow: 'Get In Touch',
				cards: [
					{ _key: 'c0', eyebrow: 'General Enquiries', content: [b('hello@unamifoundation.org', 'h3'), b('We aim to respond within 2 working days.')] },
					{ _key: 'c1', eyebrow: 'Partnership Applications', content: [b('partnerships@unamifoundation.org', 'h3'), b('For football associations interested in joining the programme.')] },
					{ _key: 'c2', eyebrow: 'Funding & Investment', content: [b('funding@unamifoundation.org', 'h3'), b('For funders, donors, and impact investors.')] },
				],
			},
		],
	},

	// ── STARS HOME /stars ─────────────────────────────────────────────────────
	{
		_id: 'page.stars.home',
		modules: [
			{
				_type: 'hero.cover', _key: 'hero',
				eyebrow: 'Unami Stars FC · 2026 Season',
				content: [
					b('Community Football. Real Results.', 'h1'),
					b('Follow Unami Stars — fixtures, results, players, and competitions. Powered by Unami Sports.'),
				],
				ctas: [
					cta('View Fixtures', 'page.stars.fixtures'),
					cta('Meet the Team', 'page.stars.teams'),
				],
			},
			{
				_type: 'stat-list', _key: 'stats',
				stats: [
					{ _key: 's0', value: '6', content: blocks('Squad Players') },
					{ _key: 's1', value: '3', content: blocks('Fixtures') },
					{ _key: 's2', value: '1W 1D 0L', content: blocks('2026 Form') },
					{ _key: 's3', value: '1st', content: blocks('League Position') },
				],
			},
			{
				_type: 'feature.bar', _key: 'features',
				items: [
					{ _key: 'f0', label: 'Live Fixtures', description: 'Up-to-date match schedule with results and standings.' },
					{ _key: 'f1', label: 'Player Profiles', description: 'Every registered player with position and jersey number.' },
					{ _key: 'f2', label: 'Competitions', description: 'Kwagucingo Community League — U19 · 2026 Season.' },
					{ _key: 'f3', label: 'Events', description: 'Community Day 2026 · 20 December · Kwagucingo Ground.' },
				],
			},
		],
	},

	// ── STARS TEAMS /stars/teams ──────────────────────────────────────────────
	{
		_id: 'page.stars.teams',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				eyebrow: 'Unami Stars FC · Kwagucingo FA',
				content: [
					b('The Squad', 'h1'),
					b('6 registered players for the 2026 season. U19. Home ground: Kwagucingo Ground, KwaZulu-Natal.'),
				],
			},
			{
				_type: 'card-list', _key: 'squad',
				eyebrow: '2026 Season Squad',
				cards: [
					{ _key: 'c0', eyebrow: 'Goalkeeper · #1', content: [b('Sipho Dlamini', 'h3'), b('Born 12 March 2008 · Appearances: 2 · Clean sheets: 1 · Consent on file ✅')] },
					{ _key: 'c1', eyebrow: 'Right Back · #2', content: [b('Lungelo Zulu', 'h3'), b('Born 5 November 2008 · Appearances: 2 · Assists: 1 · Consent on file ✅')] },
					{ _key: 'c2', eyebrow: 'Centre Back · #4', content: [b('Thabo Nkosi', 'h3'), b('Born 22 July 2007 · Appearances: 2 · Consent on file ✅')] },
					{ _key: 'c3', eyebrow: 'Central Midfield · #8', content: [b('Mpho Sithole', 'h3'), b('Born 18 April 2007 · Appearances: 2 · Goals: 1 · Assists: 1 · Consent on file ✅')] },
					{ _key: 'c4', eyebrow: 'Striker · #9', content: [b('Bongani Mokoena', 'h3'), b('Born 30 September 2006 · Appearances: 2 · Goals: 2 · Top scorer · Consent on file ✅')] },
					{ _key: 'c5', eyebrow: 'Left Wing · #11', content: [b('Siyanda Khumalo', 'h3'), b('Born 14 January 2007 · Appearances: 2 · Assists: 2 · Consent on file ✅')] },
				],
			},
		],
	},

	// ── STARS PLAYERS /stars/players ──────────────────────────────────────────
	{
		_id: 'page.stars.players',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				eyebrow: '2026 Season',
				content: [
					b('Player Profiles', 'h1'),
					b('All 6 registered players for Unami Stars FC. U19 · Kwagucingo FA · KwaZulu-Natal.'),
				],
			},
			{
				_type: 'card-list', _key: 'players',
				eyebrow: 'Registered Players',
				cards: [
					{ _key: 'c0', eyebrow: 'GK · #1', content: [b('Sipho Dlamini', 'h3'), b('DOB: 12 Mar 2008 · Nationality: South African · Joined: Jan 2026'), b('Appearances: 2 · Clean sheets: 1')] },
					{ _key: 'c1', eyebrow: 'RB · #2', content: [b('Lungelo Zulu', 'h3'), b('DOB: 5 Nov 2008 · Nationality: South African · Joined: Jan 2026'), b('Appearances: 2 · Assists: 1')] },
					{ _key: 'c2', eyebrow: 'CB · #4', content: [b('Thabo Nkosi', 'h3'), b('DOB: 22 Jul 2007 · Nationality: South African · Joined: Jan 2026'), b('Appearances: 2')] },
					{ _key: 'c3', eyebrow: 'CM · #8', content: [b('Mpho Sithole', 'h3'), b('DOB: 18 Apr 2007 · Nationality: South African · Joined: Jan 2026'), b('Appearances: 2 · Goals: 1 · Assists: 1')] },
					{ _key: 'c4', eyebrow: 'ST · #9', content: [b('Bongani Mokoena', 'h3'), b('DOB: 30 Sep 2006 · Nationality: South African · Joined: Jan 2026'), b('Appearances: 2 · Goals: 2 · Top scorer')] },
					{ _key: 'c5', eyebrow: 'LW · #11', content: [b('Siyanda Khumalo', 'h3'), b('DOB: 14 Jan 2007 · Nationality: South African · Joined: Jan 2026'), b('Appearances: 2 · Assists: 2')] },
				],
			},
		],
	},

	// ── STARS FIXTURES /stars/fixtures ────────────────────────────────────────
	{
		_id: 'page.stars.fixtures',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				eyebrow: '2026 Season',
				content: [
					b('Fixtures & Results', 'h1'),
					b('All scheduled and completed matches for Unami Stars FC. Kwagucingo Community League · U19.'),
				],
			},
			{
				_type: 'stat-list', _key: 'form',
				eyebrow: '2026 Season Form',
				stats: [
					{ _key: 's0', value: '2', content: blocks('Played') },
					{ _key: 's1', value: '1', content: blocks('Won') },
					{ _key: 's2', value: '1', content: blocks('Drawn') },
					{ _key: 's3', value: '0', content: blocks('Lost') },
					{ _key: 's4', value: '3', content: blocks('Goals For') },
					{ _key: 's5', value: '2', content: blocks('Goals Against') },
				],
			},
			{
				_type: 'card-list', _key: 'results',
				eyebrow: 'Match Results',
				cards: [
					{
						_key: 'c0',
						eyebrow: '15 Oct 2026 · Kwagucingo Ground · WIN',
						content: [
							b('Unami Stars 2–1 Riverside FC', 'h3'),
							b('Friendly · Scorers: Mokoena 34\', Sithole 67\' · Attendance: ~80'),
						],
					},
					{
						_key: 'c1',
						eyebrow: '8 Nov 2026 · Valley Ground · DRAW',
						content: [
							b('Valley United 1–1 Unami Stars', 'h3'),
							b('Friendly · Scorer: Mokoena 55\' · Attendance: ~60'),
						],
					},
					{
						_key: 'c2',
						eyebrow: '20 Dec 2026 · Kwagucingo Ground · SCHEDULED',
						content: [
							b('Community Day Match', 'h3'),
							b('Kick-off: 14:00 · Open to all community members'),
						],
					},
				],
			},
		],
	},

	// ── STARS EVENTS /stars/events ────────────────────────────────────────────
	{
		_id: 'page.stars.events',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				eyebrow: 'What\'s On',
				content: [
					b('Events', 'h1'),
					b('Community events, match days, and training sessions for Unami Stars FC and the wider Kwagucingo community.'),
				],
			},
			{
				_type: 'card-list', _key: 'events',
				eyebrow: 'Upcoming Events',
				cards: [
					{
						_key: 'c0',
						eyebrow: '20 December 2026 · Free Entry',
						content: [
							b('Community Day 2026', 'h3'),
							b('Kwagucingo Ground · 10:00–17:00'),
							b('Football, food, music, and community celebration. All welcome. Includes the Community Day Match at 14:00.'),
						],
					},
					{
						_key: 'c1',
						eyebrow: 'January 2027 · Dates TBC',
						content: [
							b('Pre-Season Training Camp', 'h3'),
							b('Open to all registered players. Fitness, tactics, and team bonding ahead of the 2027 season.'),
						],
					},
					{
						_key: 'c2',
						eyebrow: 'February 2027',
						content: [
							b('2027 Season Launch', 'h3'),
							b('Kwagucingo Ground · Official launch of the 2027 Unami Stars season. New registrations open.'),
						],
					},
				],
			},
		],
	},

	// ── STARS COMPETITIONS /stars/competitions ────────────────────────────────
	{
		_id: 'page.stars.competitions',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				eyebrow: '2026 Season',
				content: [
					b('Competitions', 'h1'),
					b('Leagues and cups that Unami Stars FC are registered in for the 2026 season.'),
				],
			},
			{
				_type: 'card-list', _key: 'comps',
				eyebrow: 'Active Competitions',
				cards: [
					{
						_key: 'c0',
						eyebrow: 'Organised by Kwagucingo FA',
						content: [
							b('Kwagucingo Community League', 'h3'),
							b('2026 Season · U19 · 4 teams registered · Round-robin format'),
							b('Top 2 teams advance to knockout final · Current position: 1st'),
						],
					},
				],
			},
			{
				_type: 'stat-list', _key: 'standing',
				eyebrow: 'League Standing',
				stats: [
					{ _key: 's0', value: '1st', content: blocks('Position') },
					{ _key: 's1', value: '2', content: blocks('Played') },
					{ _key: 's2', value: '4', content: blocks('Points') },
					{ _key: 's3', value: '3', content: blocks('Goals For') },
					{ _key: 's4', value: '2', content: blocks('Goals Against') },
					{ _key: 's5', value: '+1', content: blocks('Goal Difference') },
				],
			},
		],
	},
]

async function run() {
	console.log(`Seeding ${pages.length} pages...`)
	for (const { _id, modules } of pages) {
		await client.patch(_id).set({ modules }).commit()
		console.log(`✅ ${_id}`)
	}
	console.log('\nDone.')
}

run().catch((e) => { console.error(e.message); process.exit(1) })
