import { groq } from 'next-sanity'
import { sanityFetch } from '@/sanity/lib/live'

// ── Team ──────────────────────────────────────────────────────────────────────
const TEAM_QUERY = groq`*[_type == 'sports.team' && slug.current == $slug && publicProfile == true][0]{
	_id, title, slug, sport, season, ageGroup, community, province, status, description
}`

export async function getTeam(slug: string) {
	const { data } = await sanityFetch({ query: TEAM_QUERY, params: { slug }, perspective: 'published', stega: false })
	return data as {
		_id: string; title: string; slug: { current: string }
		sport: string; season: string; ageGroup: string
		community: string; province: string; status: string
		description: any[]
	} | null
}

// ── Players ───────────────────────────────────────────────────────────────────
const PLAYERS_QUERY = groq`*[_type == 'sports.player' && team._ref == $teamId && publicProfile == true] | order(shirtNumber asc){
	_id, displayName, shirtNumber, position, squad, introduction
}`

export async function getPlayers(teamId: string) {
	const { data } = await sanityFetch({ query: PLAYERS_QUERY, params: { teamId }, perspective: 'published', stega: false })
	return data as {
		_id: string; displayName: string; shirtNumber: number
		position: string; squad: string; introduction: any[]
	}[]
}

// ── Fixtures ──────────────────────────────────────────────────────────────────
const FIXTURES_QUERY = groq`*[_type == 'sports.fixture' && team._ref == $teamId && publicListing == true] | order(kickoff asc){
	_id, title, opponent, competition, kickoff, venue, status, homeScore, awayScore, matchReport
}`

export async function getFixtures(teamId: string) {
	const { data } = await sanityFetch({ query: FIXTURES_QUERY, params: { teamId }, perspective: 'published', stega: false })
	return data as {
		_id: string; title: string; opponent: string; competition: string
		kickoff: string; venue: string; status: string
		homeScore: number | null; awayScore: number | null; matchReport: any[]
	}[]
}

// ── Competition ───────────────────────────────────────────────────────────────
const COMPETITIONS_QUERY = groq`*[_type == 'sports.competition' && publicAnnouncementApproved == true && references($teamId)] | order(startDate desc){
	_id, title, sport, format, status, startDate, endDate, rulesSummary
}`

export async function getCompetitions(teamId: string) {
	const { data } = await sanityFetch({ query: COMPETITIONS_QUERY, params: { teamId }, perspective: 'published', stega: false })
	return data as {
		_id: string; title: string; sport: string; format: string
		status: string; startDate: string; endDate: string; rulesSummary: any[]
	}[]
}

// ── Events ────────────────────────────────────────────────────────────────────
const EVENTS_QUERY = groq`*[_type == 'sports.event' && publicListing == true && references($teamId)] | order(startDateTime asc){
	_id, title, status, startDateTime, endDateTime, publicVenueName
}`

export async function getEvents(teamId: string) {
	const { data } = await sanityFetch({ query: EVENTS_QUERY, params: { teamId }, perspective: 'published', stega: false })
	return data as {
		_id: string; title: string; status: string
		startDateTime: string; endDateTime: string; publicVenueName: string
	}[]
}
