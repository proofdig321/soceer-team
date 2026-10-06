import { groq } from 'next-sanity'
import { sanityFetch } from '@/sanity/lib/live'
import type {
	SPORTS_PUBLIC_COMPETITIONS_QUERY_RESULT,
	SPORTS_PUBLIC_EVENTS_QUERY_RESULT,
	SPORTS_PUBLIC_FIXTURES_QUERY_RESULT,
	SPORTS_PUBLIC_TEAM_ACTIVITY_QUERY_RESULT,
	SPORTS_PUBLIC_TEAM_QUERY_RESULT,
	SPORTS_PUBLIC_TEAMS_QUERY_RESULT,
} from '@/sanity/types'

export type PublicSportsTeam = SPORTS_PUBLIC_TEAMS_QUERY_RESULT[number]
export type PublicSportsFixture = SPORTS_PUBLIC_FIXTURES_QUERY_RESULT[number]
export type PublicSportsEvent = SPORTS_PUBLIC_EVENTS_QUERY_RESULT[number]
export type PublicSportsCompetition =
	SPORTS_PUBLIC_COMPETITIONS_QUERY_RESULT[number]
export type PublicSportsTeamActivity = SPORTS_PUBLIC_TEAM_ACTIVITY_QUERY_RESULT

export const SPORTS_PUBLIC_TEAMS_QUERY = groq`
	*[
		_type == 'sports.team'
		&& publicProfile == true
		&& status == 'active'
		&& demoRecord != true
		&& defined(slug.current)
	]|order(title asc){
		_id,
		title,
		'slug': slug.current,
		sport,
		community,
		province,
		'description': pt::text(description)
	}
`

export const SPORTS_PUBLIC_TEAM_QUERY = groq`
	*[
		_type == 'sports.team'
		&& slug.current == $slug
		&& publicProfile == true
		&& status == 'active'
		&& demoRecord != true
	][0]{
		_id,
		title,
		'slug': slug.current,
		sport,
		community,
		province,
		'description': pt::text(description)
	}
`

export const SPORTS_PUBLIC_FIXTURES_QUERY = groq`
	*[
		_type == 'sports.fixture'
		&& publicListing == true
		&& demoRecord != true
		&& status in ['scheduled', 'completed']
		&& defined(kickoff)
		&& team->.publicProfile == true
		&& team->.status == 'active'
		&& team->.demoRecord != true
	]|order(kickoff asc){
		title,
		kickoff,
		status,
		opponent,
		competition,
		'result': select(
			status == 'completed' && defined(homeScore) && defined(awayScore)
			=> string(homeScore) + '–' + string(awayScore),
			null
		),
		'team': team->{title, 'slug': slug.current}
	}
`

export const SPORTS_PUBLIC_EVENTS_QUERY = groq`
	*[
		_type == 'sports.event'
		&& publicListing == true
		&& demoRecord != true
		&& status in ['approved', 'scheduled', 'delivered']
		&& teamApprovalsComplete == true
		&& venueConfirmed == true
		&& safetyPlanApproved == true
		&& firstAidConfirmed == true
		&& eventBudgetApproved == true
		&& authorityChecksComplete == true
		&& count(teams[@->.publicProfile == true && @->.status == 'active' && @->.demoRecord != true]) > 0
	]|order(startDateTime asc){
		title,
		status,
		startDateTime,
		endDateTime,
		publicVenueName
	}
`

export const SPORTS_PUBLIC_COMPETITIONS_QUERY = groq`
	*[
		_type == 'sports.competition'
		&& publicAnnouncementApproved == true
		&& demoRecord != true
		&& status in ['approved', 'active', 'completed']
		&& teamApprovalComplete == true
		&& authorityChecksComplete == true
		&& safeguardingPlanApproved == true
		&& budgetApproved == true
		&& count(teams[@->.publicProfile == true && @->.status == 'active' && @->.demoRecord != true]) > 0
	]|order(startDate asc){
		title,
		sport,
		format,
		startDate,
		endDate
	}
`

export const SPORTS_PUBLIC_TEAM_ACTIVITY_QUERY = groq`
	{
		'fixtures': *[
			_type == 'sports.fixture'
			&& team._ref == $teamId
			&& publicListing == true
			&& demoRecord != true
			&& status in ['scheduled', 'completed']
			&& defined(kickoff)
		]|order(kickoff asc){
			title,
			kickoff,
			status,
			opponent,
			competition,
			'result': select(
				status == 'completed' && defined(homeScore) && defined(awayScore)
				=> string(homeScore) + '–' + string(awayScore),
				null
			),
			'team': team->{title, 'slug': slug.current}
		},
		'events': *[
			_type == 'sports.event'
			&& count(teams[_ref == $teamId]) > 0
			&& publicListing == true
			&& demoRecord != true
			&& status in ['approved', 'scheduled', 'delivered']
			&& teamApprovalsComplete == true
			&& venueConfirmed == true
			&& safetyPlanApproved == true
			&& firstAidConfirmed == true
			&& eventBudgetApproved == true
			&& authorityChecksComplete == true
		]|order(startDateTime asc){
			title,
			status,
			startDateTime,
			endDateTime,
			publicVenueName
		},
		'competitions': *[
			_type == 'sports.competition'
			&& references($teamId)
			&& publicAnnouncementApproved == true
			&& demoRecord != true
			&& status in ['approved', 'active', 'completed']
			&& teamApprovalComplete == true
			&& authorityChecksComplete == true
			&& safeguardingPlanApproved == true
			&& budgetApproved == true
		]|order(startDate asc){
			title,
			sport,
			format,
			startDate,
			endDate
		}
	}
`

export async function getPublicSportsTeams() {
	'use cache'
	const { data } = await sanityFetch({
		query: SPORTS_PUBLIC_TEAMS_QUERY,
		perspective: 'published',
		stega: false,
	})
	return data as SPORTS_PUBLIC_TEAMS_QUERY_RESULT
}

export async function getPublicSportsTeam(slug: string) {
	'use cache'
	const { data } = await sanityFetch({
		query: SPORTS_PUBLIC_TEAM_QUERY,
		params: { slug },
		perspective: 'published',
		stega: false,
	})
	return data as SPORTS_PUBLIC_TEAM_QUERY_RESULT
}

export async function getPublicSportsFixtures() {
	'use cache'
	const { data } = await sanityFetch({
		query: SPORTS_PUBLIC_FIXTURES_QUERY,
		perspective: 'published',
		stega: false,
	})
	return data as SPORTS_PUBLIC_FIXTURES_QUERY_RESULT
}

export async function getPublicSportsEvents() {
	'use cache'
	const { data } = await sanityFetch({
		query: SPORTS_PUBLIC_EVENTS_QUERY,
		perspective: 'published',
		stega: false,
	})
	return data as SPORTS_PUBLIC_EVENTS_QUERY_RESULT
}

export async function getPublicSportsCompetitions() {
	'use cache'
	const { data } = await sanityFetch({
		query: SPORTS_PUBLIC_COMPETITIONS_QUERY,
		perspective: 'published',
		stega: false,
	})
	return data as SPORTS_PUBLIC_COMPETITIONS_QUERY_RESULT
}

export async function getPublicSportsTeamActivity(teamId: string) {
	'use cache'
	const { data } = await sanityFetch({
		query: SPORTS_PUBLIC_TEAM_ACTIVITY_QUERY,
		params: { teamId },
		perspective: 'published',
		stega: false,
	})
	return data as SPORTS_PUBLIC_TEAM_ACTIVITY_QUERY_RESULT
}
