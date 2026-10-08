/**
 * Full demo content — rich pages, proper CTA references
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

const cta = (label, pageId) => ({
	_type: 'cta',
	_key: label.replace(/\s+/g, ''),
	label,
	link: { _type: 'link', type: 'internal', internal: ref(pageId) },
})

const ctaExt = (label, href) => ({
	_type: 'cta',
	_key: label.replace(/\s+/g, ''),
	label,
	link: { _type: 'link', type: 'external', external: href },
})

const block = (text) => ({
	_type: 'block',
	_key: Math.random().toString(36).slice(2),
	style: 'normal',
	markDefs: [],
	children: [{ _type: 'span', _key: 'sp', text, marks: [] }],
})

const pages = [

	// ── HOME ──────────────────────────────────────────────────────────────────
	{
		_id: 'page.sports.home',
		modules: [
			{
				_type: 'hero.cover', _key: 'hero',
				pretitle: 'Technology for Good',
				title: 'Sport that changes lives',
				intro: 'Unami Sports partners with community football associations to deliver safe, structured, and sustainable grassroots programmes across South Africa.',
				ctas: [
					cta('Explore Our Model', 'page.sports.model'),
					cta('See Unami Stars', 'page.stars.home'),
				],
			},
			{
				_type: 'stat-list', _key: 'stats',
				items: [
					{ _type: 'stat', _key: 's0', value: '1', label: 'Active Pilot' },
					{ _type: 'stat', _key: 's1', value: '6', label: 'Registered Players' },
					{ _type: 'stat', _key: 's2', value: '3', label: 'Fixtures Played' },
					{ _type: 'stat', _key: 's3', value: '100%', label: 'Community-Led' },
				],
			},
			{
				_type: 'feature.bar', _key: 'features',
				items: [
					{ _type: 'feature', _key: 'f0', icon: '🏟️', title: 'Structured Leagues', body: 'Age-appropriate competitions with proper fixtures, referees, and results tracking.' },
					{ _type: 'feature', _key: 'f1', icon: '🛡️', title: 'Safeguarding First', body: 'Every programme meets national safeguarding standards before launch.' },
					{ _type: 'feature', _key: 'f2', icon: '📊', title: 'Data-Driven', body: 'Real-time dashboards for clubs, coaches, and programme managers.' },
					{ _type: 'feature', _key: 'f3', icon: '🤝', title: 'Partnership Model', body: 'We work with existing FAs — not around them.' },
				],
			},
			{
				_type: 'callout', _key: 'cta-stars',
				title: 'See it in action',
				body: 'Unami Stars is our live pilot — a community football team running on the full Unami Sports platform.',
				ctas: [cta('Visit Unami Stars', 'page.stars.home')],
			},
		],
	},

	// ── OUR MODEL ─────────────────────────────────────────────────────────────
	{
		_id: 'page.sports.model',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				pretitle: 'How We Work',
				title: 'The Unami Sports Model',
				intro: 'A structured, technology-enabled approach to community sport — built for scale, designed for people.',
			},
			{
				_type: 'step-list', _key: 'steps',
				title: 'From Partnership to Platform',
				items: [
					{ _type: 'step', _key: 'st0', title: 'Identify a Partner FA', body: 'We work with established football associations who have community trust and existing player bases.' },
					{ _type: 'step', _key: 'st1', title: 'Governance Readiness', body: 'Together we establish safeguarding policies, constitutions, and compliance frameworks.' },
					{ _type: 'step', _key: 'st2', title: 'Platform Onboarding', body: 'Teams, players, fixtures, and competitions are registered on the Unami Sports platform.' },
					{ _type: 'step', _key: 'st3', title: 'Live Operations', body: 'Fixtures are scheduled, results recorded, and standings updated in real time.' },
					{ _type: 'step', _key: 'st4', title: 'Review & Scale', body: 'Quarterly reviews assess impact. Successful pilots expand to new regions.' },
				],
			},
			{
				_type: 'feature.bar', _key: 'pillars',
				items: [
					{ _type: 'feature', _key: 'f0', icon: '📋', title: 'Governance', body: 'Constitutions, safeguarding, and compliance built in from day one.' },
					{ _type: 'feature', _key: 'f1', icon: '💻', title: 'Technology', body: 'Purpose-built platform for grassroots sport management.' },
					{ _type: 'feature', _key: 'f2', icon: '🌍', title: 'Community', body: 'Programmes designed with and for the communities they serve.' },
					{ _type: 'feature', _key: 'f3', icon: '📈', title: 'Impact', body: 'Measurable outcomes tracked across every programme.' },
				],
			},
			{
				_type: 'callout', _key: 'cta',
				title: 'Want to partner with us?',
				body: 'If you run a community football association and want to explore a partnership, we want to hear from you.',
				ctas: [cta('Get In Touch', 'page.sports.contact')],
			},
		],
	},

	// ── PILOTS ────────────────────────────────────────────────────────────────
	{
		_id: 'page.sports.pilots',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				pretitle: 'Live Programmes',
				title: 'Our Pilot Programmes',
				intro: 'Each pilot is a real community partnership — testing, learning, and proving the model works.',
			},
			{
				_type: 'stat-list', _key: 'stats',
				items: [
					{ _type: 'stat', _key: 's0', value: '1', label: 'Active Pilot' },
					{ _type: 'stat', _key: 's1', value: 'Jan 2026', label: 'Launch Date' },
					{ _type: 'stat', _key: 's2', value: '6', label: 'Players Registered' },
					{ _type: 'stat', _key: 's3', value: '3', label: 'Fixtures Completed' },
				],
			},
			{
				_type: 'card-list', _key: 'pilots',
				title: 'Current Pilots',
				items: [
					{
						_type: 'card', _key: 'c0',
						title: 'Unami Stars FC',
						body: 'Kwagucingo FA · Launched January 2026 · U19 · 6 registered players · 3 fixtures completed · 1 competition active. The founding pilot proving the Unami Sports model in a real community setting.',
					},
					{
						_type: 'card', _key: 'c1',
						title: 'Expansion Pilots — Coming 2027',
						body: 'We are in active conversations with three additional football associations across Gauteng and KwaZulu-Natal. Applications open Q1 2027.',
					},
				],
			},
			{
				_type: 'callout', _key: 'cta',
				title: 'Follow the pilot live',
				body: 'Track Unami Stars fixtures, results, player profiles, and standings on the platform.',
				ctas: [cta('Go to Unami Stars', 'page.stars.home')],
			},
		],
	},

	// ── PARTNERS ──────────────────────────────────────────────────────────────
	{
		_id: 'page.sports.partners',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				pretitle: 'Who We Work With',
				title: 'Our Partners',
				intro: 'Unami Sports is built on partnerships — with football associations, funders, and community organisations.',
			},
			{
				_type: 'card-list', _key: 'partners',
				title: 'Current Partners',
				items: [
					{
						_type: 'card', _key: 'c0',
						title: 'Kwagucingo FA',
						body: 'Our founding football association partner based in KwaZulu-Natal. Home of the Unami Stars pilot programme. Kwagucingo FA brings deep community trust, an established player base, and a commitment to youth development.',
					},
					{
						_type: 'card', _key: 'c1',
						title: 'Unami Foundation',
						body: 'The parent organisation funding and governing the Unami Sports programme. The Foundation provides strategic oversight, compliance frameworks, and long-term sustainability planning.',
					},
				],
			},
			{
				_type: 'accordion-list', _key: 'faq',
				title: 'Partnership FAQs',
				items: [
					{ _type: 'accordion', _key: 'ac0', title: 'How do we become a partner FA?', body: 'Contact us via the Get Involved page. We will arrange an initial call to assess fit and readiness. The process typically takes 4–6 weeks from first contact to onboarding.' },
					{ _type: 'accordion', _key: 'ac1', title: 'Is there a cost to partner FAs?', body: 'No. Unami Sports provides the platform, training, and ongoing support at no cost to community FAs during the pilot phase.' },
					{ _type: 'accordion', _key: 'ac2', title: 'What do you need from a partner FA?', body: 'An existing player base, a commitment to safeguarding standards, a designated programme coordinator, and willingness to participate in quarterly reviews.' },
					{ _type: 'accordion', _key: 'ac3', title: 'What does the platform provide?', body: 'Team and player registration, fixture scheduling, results tracking, competition standings, event management, and governance documentation — all in one place.' },
				],
			},
			{
				_type: 'callout', _key: 'cta',
				title: 'Become a partner',
				body: 'We are actively looking for community FAs to join the programme in 2027.',
				ctas: [cta('Get Involved', 'page.sports.get-involved')],
			},
		],
	},

	// ── GET INVOLVED ──────────────────────────────────────────────────────────
	{
		_id: 'page.sports.get-involved',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				pretitle: 'Join the Movement',
				title: 'Get Involved',
				intro: 'Whether you run a football association, want to volunteer, or are looking to fund community sport — there is a place for you in Unami Sports.',
			},
			{
				_type: 'card-list', _key: 'ways',
				title: 'Ways to Get Involved',
				items: [
					{ _type: 'card', _key: 'c0', title: 'Partner FA', body: 'Bring your football association onto the Unami Sports platform. We provide the technology, governance frameworks, and ongoing support. You bring the community.' },
					{ _type: 'card', _key: 'c1', title: 'Volunteer', body: 'Support programme delivery, coaching, administration, or digital skills training. We match volunteers to programmes based on skills and location.' },
					{ _type: 'card', _key: 'c2', title: 'Fund', body: 'Help us expand to more communities across South Africa. Funding supports platform development, programme delivery, and safeguarding training.' },
					{ _type: 'card', _key: 'c3', title: 'Spread the Word', body: 'Share what we are doing with your network. Every connection helps us reach more communities and more young people.' },
				],
			},
			{
				_type: 'callout', _key: 'cta',
				title: 'Ready to take the next step?',
				body: 'Get in touch and we will find the right way for you to contribute.',
				ctas: [cta('Contact Us', 'page.sports.contact')],
			},
		],
	},

	// ── CONTACT ───────────────────────────────────────────────────────────────
	{
		_id: 'page.sports.contact',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				pretitle: 'Say Hello',
				title: 'Contact Unami Sports',
				intro: 'We would love to hear from you — whether you are a potential partner, funder, or just curious about what we do.',
			},
			{
				_type: 'card-list', _key: 'ways',
				title: 'Get In Touch',
				items: [
					{ _type: 'card', _key: 'c0', title: 'General Enquiries', body: 'hello@unamifoundation.org — We aim to respond within 2 working days.' },
					{ _type: 'card', _key: 'c1', title: 'Partnership Applications', body: 'partnerships@unamifoundation.org — For football associations interested in joining the programme.' },
					{ _type: 'card', _key: 'c2', title: 'Funding & Investment', body: 'funding@unamifoundation.org — For funders, donors, and impact investors.' },
				],
			},
		],
	},

	// ── STARS HOME ────────────────────────────────────────────────────────────
	{
		_id: 'page.stars.home',
		modules: [
			{
				_type: 'hero.cover', _key: 'hero',
				pretitle: 'Unami Stars FC · 2026 Season',
				title: 'Community Football. Real Results.',
				intro: 'Follow Unami Stars — fixtures, results, players, and competitions. Powered by Unami Sports.',
				ctas: [
					cta('View Fixtures', 'page.stars.fixtures'),
					cta('Meet the Team', 'page.stars.teams'),
				],
			},
			{
				_type: 'stat-list', _key: 'stats',
				items: [
					{ _type: 'stat', _key: 's0', value: '6', label: 'Squad Players' },
					{ _type: 'stat', _key: 's1', value: '3', label: 'Fixtures' },
					{ _type: 'stat', _key: 's2', value: '1W 1D 0L', label: '2026 Form' },
					{ _type: 'stat', _key: 's3', value: '1st', label: 'League Position' },
				],
			},
			{
				_type: 'feature.bar', _key: 'features',
				items: [
					{ _type: 'feature', _key: 'f0', icon: '📅', title: 'Live Fixtures', body: 'Up-to-date match schedule with results and standings.' },
					{ _type: 'feature', _key: 'f1', icon: '👥', title: 'Player Profiles', body: 'Every registered player with position and jersey number.' },
					{ _type: 'feature', _key: 'f2', icon: '🏆', title: 'Competitions', body: 'Kwagucingo Community League — U19 · 2026 Season.' },
					{ _type: 'feature', _key: 'f3', icon: '📍', title: 'Events', body: 'Community Day 2026 · 20 December · Kwagucingo Ground.' },
				],
			},
		],
	},

	// ── STARS TEAMS ───────────────────────────────────────────────────────────
	{
		_id: 'page.stars.teams',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				pretitle: 'Unami Stars FC · Kwagucingo FA',
				title: 'The Squad',
				intro: '6 registered players for the 2026 season. U19. Home ground: Kwagucingo Ground, KwaZulu-Natal.',
			},
			{
				_type: 'card-list', _key: 'squad',
				title: '2026 Season Squad',
				items: [
					{ _type: 'card', _key: 'c0', title: 'Sipho Dlamini', body: 'Goalkeeper · #1 · Born 12 March 2008 · Consent on file ✅' },
					{ _type: 'card', _key: 'c1', title: 'Lungelo Zulu', body: 'Right Back · #2 · Born 5 November 2008 · Consent on file ✅' },
					{ _type: 'card', _key: 'c2', title: 'Thabo Nkosi', body: 'Centre Back · #4 · Born 22 July 2007 · Consent on file ✅' },
					{ _type: 'card', _key: 'c3', title: 'Mpho Sithole', body: 'Central Midfield · #8 · Born 18 April 2007 · Consent on file ✅' },
					{ _type: 'card', _key: 'c4', title: 'Bongani Mokoena', body: 'Striker · #9 · Born 30 September 2006 · Consent on file ✅' },
					{ _type: 'card', _key: 'c5', title: 'Siyanda Khumalo', body: 'Left Wing · #11 · Born 14 January 2007 · Consent on file ✅' },
				],
			},
		],
	},

	// ── STARS PLAYERS ─────────────────────────────────────────────────────────
	{
		_id: 'page.stars.players',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				pretitle: '2026 Season',
				title: 'Player Profiles',
				intro: 'All 6 registered players for Unami Stars FC. U19 · Kwagucingo FA · KwaZulu-Natal.',
			},
			{
				_type: 'card-list', _key: 'players',
				title: 'Registered Players',
				items: [
					{ _type: 'card', _key: 'c0', title: 'Sipho Dlamini — GK', body: '#1 · Goalkeeper · DOB: 12 Mar 2008 · Nationality: South African · Joined: Jan 2026 · Appearances: 2 · Clean sheets: 1' },
					{ _type: 'card', _key: 'c1', title: 'Lungelo Zulu — RB', body: '#2 · Right Back · DOB: 5 Nov 2008 · Nationality: South African · Joined: Jan 2026 · Appearances: 2 · Assists: 1' },
					{ _type: 'card', _key: 'c2', title: 'Thabo Nkosi — CB', body: '#4 · Centre Back · DOB: 22 Jul 2007 · Nationality: South African · Joined: Jan 2026 · Appearances: 2 · Goals: 0' },
					{ _type: 'card', _key: 'c3', title: 'Mpho Sithole — CM', body: '#8 · Central Midfield · DOB: 18 Apr 2007 · Nationality: South African · Joined: Jan 2026 · Appearances: 2 · Goals: 1 · Assists: 1' },
					{ _type: 'card', _key: 'c4', title: 'Bongani Mokoena — ST', body: '#9 · Striker · DOB: 30 Sep 2006 · Nationality: South African · Joined: Jan 2026 · Appearances: 2 · Goals: 2 · Top scorer' },
					{ _type: 'card', _key: 'c5', title: 'Siyanda Khumalo — LW', body: '#11 · Left Wing · DOB: 14 Jan 2007 · Nationality: South African · Joined: Jan 2026 · Appearances: 2 · Goals: 0 · Assists: 2' },
				],
			},
		],
	},

	// ── STARS FIXTURES ────────────────────────────────────────────────────────
	{
		_id: 'page.stars.fixtures',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				pretitle: '2026 Season',
				title: 'Fixtures & Results',
				intro: 'All scheduled and completed matches for Unami Stars FC. Kwagucingo Community League · U19.',
			},
			{
				_type: 'stat-list', _key: 'form',
				items: [
					{ _type: 'stat', _key: 's0', value: '2', label: 'Played' },
					{ _type: 'stat', _key: 's1', value: '1', label: 'Won' },
					{ _type: 'stat', _key: 's2', value: '1', label: 'Drawn' },
					{ _type: 'stat', _key: 's3', value: '0', label: 'Lost' },
					{ _type: 'stat', _key: 's4', value: '3', label: 'Goals For' },
					{ _type: 'stat', _key: 's5', value: '2', label: 'Goals Against' },
				],
			},
			{
				_type: 'card-list', _key: 'results',
				title: 'Match Results',
				items: [
					{ _type: 'card', _key: 'c0', title: 'Unami Stars 2–1 Riverside FC', body: 'Friendly · 15 October 2026 · Kwagucingo Ground · Result: WIN · Scorers: Mokoena 34\', Sithole 67\' · Attendance: ~80' },
					{ _type: 'card', _key: 'c1', title: 'Valley United 1–1 Unami Stars', body: 'Friendly · 8 November 2026 · Valley Ground (Away) · Result: DRAW · Scorer: Mokoena 55\' · Attendance: ~60' },
					{ _type: 'card', _key: 'c2', title: 'Community Day Match', body: 'Community Day · 20 December 2026 · Kwagucingo Ground · Status: SCHEDULED · Kick-off: 14:00 · Open to all community members' },
				],
			},
		],
	},

	// ── STARS EVENTS ──────────────────────────────────────────────────────────
	{
		_id: 'page.stars.events',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				pretitle: 'What\'s On',
				title: 'Events',
				intro: 'Community events, match days, and training sessions for Unami Stars FC and the wider Kwagucingo community.',
			},
			{
				_type: 'card-list', _key: 'events',
				title: 'Upcoming Events',
				items: [
					{ _type: 'card', _key: 'c0', title: 'Community Day 2026', body: '20 December 2026 · Kwagucingo Ground · 10:00–17:00 · Football, food, music, and community celebration. All welcome. Free entry. Includes the Community Day Match at 14:00.' },
					{ _type: 'card', _key: 'c1', title: 'Pre-Season Training Camp', body: 'January 2027 · Dates TBC · Open to all registered players. Fitness, tactics, and team bonding ahead of the 2027 season.' },
					{ _type: 'card', _key: 'c2', title: '2027 Season Launch', body: 'February 2027 · Kwagucingo Ground · Official launch of the 2027 Unami Stars season. New registrations open.' },
				],
			},
		],
	},

	// ── STARS COMPETITIONS ────────────────────────────────────────────────────
	{
		_id: 'page.stars.competitions',
		modules: [
			{
				_type: 'hero.split', _key: 'hero',
				pretitle: '2026 Season',
				title: 'Competitions',
				intro: 'Leagues and cups that Unami Stars FC are registered in for the 2026 season.',
			},
			{
				_type: 'card-list', _key: 'comps',
				title: 'Active Competitions',
				items: [
					{ _type: 'card', _key: 'c0', title: 'Kwagucingo Community League', body: '2026 Season · U19 · Organised by Kwagucingo FA · 4 teams registered · Round-robin format · Top 2 teams advance to knockout final · Unami Stars current position: 1st' },
				],
			},
			{
				_type: 'stat-list', _key: 'standing',
				items: [
					{ _type: 'stat', _key: 's0', value: '1st', label: 'League Position' },
					{ _type: 'stat', _key: 's1', value: '2', label: 'Played' },
					{ _type: 'stat', _key: 's2', value: '4', label: 'Points' },
					{ _type: 'stat', _key: 's3', value: '3', label: 'Goals For' },
					{ _type: 'stat', _key: 's4', value: '2', label: 'Goals Against' },
					{ _type: 'stat', _key: 's5', value: '+1', label: 'Goal Difference' },
				],
			},
		],
	},
]

async function run() {
	console.log(`Updating ${pages.length} pages...`)
	for (const page of pages) {
		const { _id, modules } = page
		await client.patch(_id).set({ modules }).commit()
		console.log(`✅ ${_id}`)
	}
	console.log('Done.')
}

run().catch(e => { console.error(e.message); process.exit(1) })
