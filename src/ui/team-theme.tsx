import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'

const QUERY = groq`*[_type == 'sports.team' && slug.current == $slug][0]{
	brandPrimary,
	brandSecondary,
}`

async function getTeamBrand(slug: string) {
	'use cache'
	return client
		.withConfig({ token, useCdn: true, perspective: 'published' })
		.fetch(QUERY, { slug })
}

// Platform defaults — matches app.css @theme values
const DEFAULTS = {
	primary: '#f3b942',   // --color-gold
	secondary: '#173426', // --color-forest
}

export default async function TeamTheme({ slug }: { slug: string }) {
	const brand = await getTeamBrand(slug)

	const primary = brand?.brandPrimary || DEFAULTS.primary
	const secondary = brand?.brandSecondary || DEFAULTS.secondary

	// Only inject if at least one value differs from defaults
	if (primary === DEFAULTS.primary && secondary === DEFAULTS.secondary) return null

	const css = [
		`--color-gold: ${primary};`,
		`--color-gold-light: color-mix(in oklab, ${primary} 70%, white);`,
		`--color-gold-dark: color-mix(in oklab, ${primary} 70%, black);`,
		`--color-forest: ${secondary};`,
		`--color-forest-mid: color-mix(in oklab, ${secondary} 70%, #0f532e);`,
		`--color-forest-light: color-mix(in oklab, ${secondary} 85%, white);`,
		`--color-primary: ${primary};`,
		`--color-background: color-mix(in oklab, ${secondary} 60%, black);`,
	].join(' ')

	return <style>{`:root { ${css} }`}</style>
}
