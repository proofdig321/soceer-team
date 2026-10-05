import Link from 'next/link'

const directoryLinks = [
	{
		href: '/teams',
		title: 'Teams',
		description: 'Find teams that have chosen to publish a public profile.',
	},
	{
		href: '/fixtures',
		title: 'Fixtures',
		description: 'See approved fixtures and completed results.',
	},
	{
		href: '/events',
		title: 'Events',
		description: 'Browse events cleared for public listing.',
	},
	{
		href: '/competitions',
		title: 'Competitions',
		description: 'Explore approved competition announcements.',
	},
]

export default function SportsHomeFallback() {
	return (
		<div className="grid gap-12 pb-12">
			<section className="bg-emerald-950 text-white">
				<div className="section grid gap-8 py-16 md:grid-cols-[1.4fr_0.6fr] md:items-end md:py-24">
					<div className="grid justify-items-start gap-6">
						<p className="technical text-amber-300">
							Community sport, built together
						</p>
						<h1 className="max-w-4xl text-5xl leading-tight font-bold text-balance md:text-7xl">
							Stronger teams. Stronger communities.
						</h1>
						<p className="max-w-2xl text-lg leading-relaxed text-white/80">
							Unami Sports supports community-led sport with practical tools,
							shared learning and public information.
						</p>
						<div className="flex flex-wrap gap-3">
							<Link
								className="action bg-amber-300 text-emerald-950"
								href="/sports"
							>
								Explore community sport
							</Link>
							<Link
								className="action-outline border-white/40 bg-transparent text-white hover:border-white"
								href="/teams"
							>
								Browse teams
							</Link>
						</div>
					</div>
					<p className="max-w-sm border-l-2 border-amber-300 pl-4 text-sm leading-relaxed text-white/70">
						Public listings appear only when they have been deliberately
						published. Player profiles and internal operational records are not
						shown here.
					</p>
				</div>
			</section>

			<section className="section grid gap-6">
				<header className="grid gap-2">
					<p className="technical text-emerald-800">Explore</p>
					<h2 className="h1">Community sport directory</h2>
					<p className="max-w-2xl">
						Choose a directory to see approved public information. Listings may
						be empty while teams and events are being onboarded.
					</p>
				</header>
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{directoryLinks.map(({ href, title, description }) => (
						<li
							className="border-stroke grid content-start gap-3 border p-5"
							key={href}
						>
							<h3 className="h3">
								<Link className="link" href={href}>
									{title}
								</Link>
							</h3>
							<p>{description}</p>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}
