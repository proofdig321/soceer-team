/**
 * Sports domain components — Team, Fixture, Event, Competition.
 * All consume the existing public projection types from sports-public.ts.
 * No raw Sports documents are queried here.
 */

import Link from 'next/link'
import type {
	PublicSportsCompetition,
	PublicSportsEvent,
	PublicSportsFixture,
	PublicSportsTeam,
} from '@/lib/sports-public'
import {
	SportsCard,
	SportsCardGrid,
	SportsEmpty,
	SportsBadge,
	SportsMeta,
	formatSportsDate,
	sportLabel,
	competitionFormatLabel,
	fixtureStatusBadge,
} from './primitives'

// ─── Team ─────────────────────────────────────────────────────────────────────

export function TeamCard({ team }: { team: PublicSportsTeam }) {
	return (
		<SportsCard as="li">
			<h3 className="h3">
				{team.slug ? (
					<Link className="link" href={`/teams/${team.slug}`}>
						{team.title}
					</Link>
				) : (
					team.title
				)}
			</h3>
			<SportsMeta
				items={[sportLabel(team.sport), team.community, team.province]}
			/>
			{team.description && (
				<p className="line-clamp-3 text-sm">{team.description}</p>
			)}
		</SportsCard>
	)
}

export function TeamGrid({ teams }: { teams: PublicSportsTeam[] }) {
	if (!teams.length) return <SportsEmpty label="teams" />
	return (
		<SportsCardGrid cols={3}>
			{teams.map((team) => (
				<TeamCard key={team._id} team={team} />
			))}
		</SportsCardGrid>
	)
}

export function TeamHero({ team }: { team: PublicSportsTeam }) {
	return (
		<div className="grid gap-4 border-b border-stroke pb-8">
			<div className="flex flex-wrap items-center gap-3">
				{team.sport && (
					<SportsBadge label={sportLabel(team.sport) ?? team.sport} />
				)}
				{team.community && (
					<SportsBadge label={team.community} variant="muted" />
				)}
				{team.province && (
					<SportsBadge label={team.province} variant="muted" />
				)}
			</div>
			<h1 className="h0 max-w-3xl">{team.title}</h1>
			{team.description && (
				<p className="max-w-prose text-lg leading-relaxed">{team.description}</p>
			)}
		</div>
	)
}

// ─── Fixture ──────────────────────────────────────────────────────────────────

export function FixtureCard({
	fixture,
	hideTeamLink = false,
}: {
	fixture: PublicSportsFixture
	hideTeamLink?: boolean
}) {
	const badge = fixtureStatusBadge(fixture.status)

	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{fixture.title ?? 'Fixture'}</h3>
				{badge && <SportsBadge label={badge.label} variant={badge.variant} />}
			</div>

			<SportsMeta
				items={[
					!hideTeamLink && fixture.team?.title && !fixture.team.slug
						? fixture.team.title
						: undefined,
					fixture.kickoff
						? formatSportsDate(fixture.kickoff, 'datetime')
						: undefined,
					fixture.competition ?? undefined,
				]}
			/>

			{!hideTeamLink && fixture.team?.slug && (
				<p className="text-sm">
					<Link className="link" href={`/teams/${fixture.team.slug}`}>
						{fixture.team.title}
					</Link>
				</p>
			)}

			{fixture.result && (
				<p className="font-mono text-lg font-bold">{fixture.result}</p>
			)}
		</SportsCard>
	)
}

export function FixtureList({
	fixtures,
	emptyLabel = 'fixtures',
	hideTeamLink = false,
}: {
	fixtures: PublicSportsFixture[]
	emptyLabel?: string
	hideTeamLink?: boolean
}) {
	if (!fixtures.length) return <SportsEmpty label={emptyLabel} />
	return (
		<ul className="grid gap-4">
			{fixtures.map((fixture, i) => (
				<FixtureCard
					key={`${fixture.kickoff ?? i}-${fixture.title}`}
					fixture={fixture}
					hideTeamLink={hideTeamLink}
				/>
			))}
		</ul>
	)
}

// Split upcoming vs results — used on /fixtures page
export function FixtureSplitList({
	fixtures,
}: {
	fixtures: PublicSportsFixture[]
}) {
	if (!fixtures.length) return <SportsEmpty label="fixtures" />

	const upcoming = fixtures.filter((f) => f.status !== 'completed')
	const results = fixtures.filter((f) => f.status === 'completed')

	return (
		<div className="grid gap-10">
			{upcoming.length > 0 && (
				<section className="grid gap-5">
					<h2 className="h2">Upcoming fixtures</h2>
					<FixtureList fixtures={upcoming} />
				</section>
			)}
			{results.length > 0 && (
				<section className="grid gap-5">
					<h2 className="h2">Results</h2>
					<FixtureList fixtures={results} />
				</section>
			)}
		</div>
	)
}

// ─── Event ────────────────────────────────────────────────────────────────────

const eventStatusLabel: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'muted' }> = {
	approved: { label: 'Upcoming', variant: 'default' },
	scheduled: { label: 'Upcoming', variant: 'default' },
	delivered: { label: 'Delivered', variant: 'success' },
}

export function EventCard({ event }: { event: PublicSportsEvent }) {
	const statusBadge = event.status ? eventStatusLabel[event.status] : undefined

	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{event.title ?? 'Event'}</h3>
				{statusBadge && (
					<SportsBadge label={statusBadge.label} variant={statusBadge.variant} />
				)}
			</div>
			{event.startDateTime && (
				<SportsMeta
					items={[
						formatSportsDate(event.startDateTime, 'datetime'),
						event.endDateTime &&
						event.endDateTime !== event.startDateTime
							? `until ${formatSportsDate(event.endDateTime, 'datetime')}`
							: undefined,
					]}
				/>
			)}
			{event.publicVenueName && (
				<p className="text-sm">{event.publicVenueName}</p>
			)}
		</SportsCard>
	)
}

export function EventList({
	events,
	emptyLabel = 'events',
}: {
	events: PublicSportsEvent[]
	emptyLabel?: string
}) {
	if (!events.length) return <SportsEmpty label={emptyLabel} />
	return (
		<ul className="grid gap-4">
			{events.map((event, i) => (
				<EventCard
					key={`${event.startDateTime ?? i}-${event.title}`}
					event={event}
				/>
			))}
		</ul>
	)
}

// ─── Competition ──────────────────────────────────────────────────────────────

const competitionStatusLabel: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'muted' }> = {
	approved: { label: 'Upcoming', variant: 'default' },
	active: { label: 'Active', variant: 'success' },
	completed: { label: 'Completed', variant: 'muted' },
}

export function CompetitionCard({
	competition,
}: {
	competition: PublicSportsCompetition
}) {
	const dateRange =
		competition.startDate && competition.endDate &&
		competition.endDate !== competition.startDate
			? `${formatSportsDate(competition.startDate)} – ${formatSportsDate(competition.endDate)}`
			: competition.startDate
				? formatSportsDate(competition.startDate)
				: undefined

	const statusBadge = competition.status
		? competitionStatusLabel[competition.status]
		: undefined

	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{competition.title ?? 'Competition'}</h3>
				{statusBadge && (
					<SportsBadge label={statusBadge.label} variant={statusBadge.variant} />
				)}
			</div>
			<SportsMeta
				items={[
					sportLabel(competition.sport),
					competitionFormatLabel(competition.format),
					dateRange,
				]}
			/>
		</SportsCard>
	)
}

export function CompetitionList({
	competitions,
	emptyLabel = 'competitions',
}: {
	competitions: PublicSportsCompetition[]
	emptyLabel?: string
}) {
	if (!competitions.length) return <SportsEmpty label={emptyLabel} />
	return (
		<ul className="grid gap-4 sm:grid-cols-2">
			{competitions.map((competition, i) => (
				<CompetitionCard
					key={`${competition.startDate ?? i}-${competition.title}`}
					competition={competition}
				/>
			))}
		</ul>
	)
}

// ─── Activity section (used on team detail page) ──────────────────────────────

export function TeamActivitySection({
	fixtures,
	events,
	competitions,
	hideTeamLink = false,
}: {
	fixtures: PublicSportsFixture[]
	events: PublicSportsEvent[]
	competitions: PublicSportsCompetition[]
	hideTeamLink?: boolean
}) {
	const hasFixtures = fixtures.length > 0
	const hasEvents = events.length > 0
	const hasCompetitions = competitions.length > 0
	const hasAny = hasFixtures || hasEvents || hasCompetitions

	if (!hasAny) {
		return (
			<SportsEmpty label="public fixtures, events or competitions for this team" />
		)
	}

	return (
		<div className="grid gap-10">
			{hasFixtures && (
				<section className="grid gap-5">
					<h2 className="h2">Fixtures and results</h2>
					<FixtureList fixtures={fixtures} hideTeamLink={hideTeamLink} />
				</section>
			)}
			{hasEvents && (
				<section className="grid gap-5">
					<h2 className="h2">Events</h2>
					<EventList events={events} />
				</section>
			)}
			{hasCompetitions && (
				<section className="grid gap-5">
					<h2 className="h2">Competitions</h2>
					<CompetitionList competitions={competitions} />
				</section>
			)}
		</div>
	)
}
