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
			<h2 className="h3">
				{team.slug ? (
					<Link className="link" href={`/teams/${team.slug}`}>
						{team.title}
					</Link>
				) : (
					team.title
				)}
			</h2>
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

export function FixtureCard({ fixture }: { fixture: PublicSportsFixture }) {
	const badge = fixtureStatusBadge(fixture.status)

	return (
		<SportsCard as="li">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<h3 className="h4 flex-1">{fixture.title ?? 'Fixture'}</h3>
				{badge && <SportsBadge label={badge.label} variant={badge.variant} />}
			</div>

			<SportsMeta
				items={[
					fixture.team?.slug
						? undefined
						: fixture.team?.title,
					fixture.opponent ? `vs ${fixture.opponent}` : undefined,
					fixture.kickoff ? formatSportsDate(fixture.kickoff, 'datetime') : undefined,
				]}
			/>

			{fixture.team?.slug && (
				<p className="text-sm">
					<Link className="link" href={`/teams/${fixture.team.slug}`}>
						{fixture.team.title}
					</Link>
					{fixture.opponent && ` vs ${fixture.opponent}`}
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
}: {
	fixtures: PublicSportsFixture[]
	emptyLabel?: string
}) {
	if (!fixtures.length) return <SportsEmpty label={emptyLabel} />
	return (
		<ul className="grid gap-4">
			{fixtures.map((fixture) => (
				<FixtureCard
					key={`${fixture.team?.slug}-${fixture.kickoff}-${fixture.title}`}
					fixture={fixture}
				/>
			))}
		</ul>
	)
}

// ─── Event ────────────────────────────────────────────────────────────────────

export function EventCard({ event }: { event: PublicSportsEvent }) {
	return (
		<SportsCard as="li">
			<h3 className="h4">{event.title ?? 'Event'}</h3>
			{event.startDateTime && (
				<SportsMeta
					items={[
						formatSportsDate(event.startDateTime, 'datetime'),
						event.endDateTime
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
					key={`${event.title}-${event.startDateTime}-${i}`}
					event={event}
				/>
			))}
		</ul>
	)
}

// ─── Competition ──────────────────────────────────────────────────────────────

export function CompetitionCard({
	competition,
}: {
	competition: PublicSportsCompetition
}) {
	return (
		<SportsCard as="li">
			<h3 className="h4">{competition.title ?? 'Competition'}</h3>
			<SportsMeta
				items={[
					sportLabel(competition.sport),
					competitionFormatLabel(competition.format),
					competition.startDate
						? formatSportsDate(competition.startDate)
						: undefined,
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
					key={`${competition.title}-${competition.startDate}-${i}`}
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
}: {
	fixtures: PublicSportsFixture[]
	events: PublicSportsEvent[]
	competitions: PublicSportsCompetition[]
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
					<FixtureList fixtures={fixtures} />
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
