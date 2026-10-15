import defineModule from '@/sanity/schemaTypes/fragments/define-module'
import { defineField, defineType } from 'sanity'
import { TrendUpwardIcon } from '@sanity/icons/TrendUpward'

export default defineModule(
	defineType({
		name: 'sports.season-stats',
		title: 'Season statistics',
		type: 'object',
		icon: TrendUpwardIcon,
		fields: [
			defineField({ name: 'eyebrow', type: 'string' }),
			defineField({ name: 'heading', type: 'string' }),
			defineField({
				name: 'teamId',
				title: 'Team',
				type: 'reference',
				to: [{ type: 'sports.team' }],
				description: 'Stats are computed live from completed fixtures for this team.',
			}),
			defineField({
				name: 'season',
				type: 'string',
				description: 'Filter to a specific season e.g. 2026. Leave blank for all-time.',
			}),
		],
		preview: {
			select: { team: 'teamId.title', season: 'season' },
			prepare: ({ team, season }) => ({ title: 'Season statistics', subtitle: [team, season].filter(Boolean).join(' · ') }),
		},
	}),
)
