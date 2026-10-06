export const dev =
	process.env.NODE_ENV === 'development' ||
	process.env.VERCEL_ENV === 'preview' ||
	process.env.CONTEXT === 'deploy-preview' ||
	process.env.CONTEXT === 'branch-deploy'

export const ROUTES = {
	studio: 'admin',
	blog: 'blog',
	a11y: 'accessibility-statement',
	// Sports directory routes
	sports: 'sports',
	teams: 'teams',
	fixtures: 'fixtures',
	events: 'events',
	competitions: 'competitions',
} as const

export const SPORTS_ROUTES = [
	ROUTES.sports,
	ROUTES.teams,
	ROUTES.fixtures,
	ROUTES.events,
	ROUTES.competitions,
] as const
