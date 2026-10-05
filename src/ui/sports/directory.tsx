import Link from 'next/link'
import type {
	PublicSportsCompetition,
	PublicSportsEvent,
	PublicSportsFixture,
	PublicSportsTeam,
} from '@/lib/sports-public'

const links = [
	{ href: '/sports', label: 'Overview' },
	{ href: '/teams', label: 'Teams' },
	{ href: '/fixtures', label: 'Fixtures' },
	{ href: '/events', label: 'Events' },
	{ href: '/competitions', label: 'Competitions' },
]

export function SportsDirectoryNav() {
	return (
		<nav aria-label="Sports directory">
			<ul className="flex flex-wrap gap-x-5 gap-y-2">
				{links.map(({ href, label }) => (
					<li key={href}>
						<Link className="link" href={href}>
							{label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}

export function SportsDirectoryPage({
	title,
	intro,
	children,
}: {
	title: string
	intro: string
	children: React.ReactNode
}) {
	return (
		<div className="section grid gap-8 py-12">
			<header className="grid gap-4">
				<p className="technical">Unami Sports</p>
				<h1 className="h0">{title}</h1>
				<p className="max-w-prose">{intro}</p>
				<SportsDirectoryNav />
			</header>
			{children}
		</div>
	)
}

export function EmptyDirectory({ kind }: { kind: string }) {
	return (
		<p className="border-stroke border p-5">
			No approved public {kind} are listed right now.
		</p>
	)
}

export function TeamCards({ teams }: { teams: PublicSportsTeam[] }) {
	if (!teams.length) return <EmptyDirectory kind="teams" />

	return (
		<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{teams.map((team) => (
				<li
					className="border-stroke grid content-start gap-3 border p-5"
					key={team._id}
				>
					<h2 className="h2">
						{team.slug ? (
							<Link className="link" href={`/teams/${team.slug}`}>
								{team.title}
							</Link>
						) : (
							team.title
						)}
					</h2>
					<p>
						{[team.sport, team.community, team.province]
							.filter(Boolean)
							.join(' · ')}
					</p>
					{team.description && <p>{team.description}</p>}
				</li>
			))}
		</ul>
	)
}

export function FixtureList({ fixtures }: { fixtures: PublicSportsFixture[] }) {
	if (!fixtures.length) return <EmptyDirectory kind="fixtures" />

	return (
		<ul className="grid gap-4">
			{fixtures.map((fixture) => (
				<li
					className="border-stroke grid gap-2 border p-5"
					key={`${fixture.team?.slug}-${fixture.kickoff}-${fixture.title}`}
				>
					<h2 className="h3">{fixture.title ?? 'Fixture'}</h2>
					<p>
						{fixture.team?.slug ? (
							<>
								<Link className="link" href={`/teams/${fixture.team.slug}`}>
									{fixture.team.title}
								</Link>
								{' · '}
							</>
						) : (
							fixture.team?.title
						)}
						{fixture.opponent}
						{fixture.kickoff && ` · ${formatDate(fixture.kickoff)}`}
						{fixture.result && ` · ${fixture.result}`}
					</p>
				</li>
			))}
		</ul>
	)
}

export function EventList({ events }: { events: PublicSportsEvent[] }) {
	if (!events.length) return <EmptyDirectory kind="events" />

	return (
		<ul className="grid gap-4">
			{events.map((event, index) => (
				<li
					className="border-stroke grid gap-2 border p-5"
					key={`${event.title}-${event.startDateTime}-${index}`}
				>
					<h2 className="h3">{event.title ?? 'Event'}</h2>
					{event.startDateTime && <p>{formatDate(event.startDateTime)}</p>}
					{event.publicVenueName && <p>{event.publicVenueName}</p>}
				</li>
			))}
		</ul>
	)
}

export function CompetitionList({
	competitions,
}: {
	competitions: PublicSportsCompetition[]
}) {
	if (!competitions.length) return <EmptyDirectory kind="competitions" />

	return (
		<ul className="grid gap-4">
			{competitions.map((competition, index) => (
				<li
					className="border-stroke grid gap-2 border p-5"
					key={`${competition.title}-${competition.startDate}-${index}`}
				>
					<h2 className="h3">{competition.title ?? 'Competition'}</h2>
					<p>
						{[competition.sport, competition.format]
							.filter(Boolean)
							.join(' · ')}
						{competition.startDate && ` · ${formatDate(competition.startDate)}`}
					</p>
				</li>
			))}
		</ul>
	)
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat('en-ZA', {
		dateStyle: 'medium',
		timeZone: 'Africa/Johannesburg',
	}).format(new Date(value))
}
