import defineModule from '@/sanity/schemaTypes/fragments/define-module'
import { defineField, defineType } from 'sanity'
import { TrendUpwardIcon } from '@sanity/icons/TrendUpward'

export default defineModule(
	defineType({
		name: 'sports.standings',
		title: 'League standings',
		type: 'object',
		icon: TrendUpwardIcon,
		fields: [
			defineField({ name: 'eyebrow', type: 'string' }),
			defineField({ name: 'heading', type: 'string' }),
			defineField({
				name: 'competitionId',
				title: 'Competition',
				type: 'reference',
				to: [{ type: 'sports.competition' }],
				description: 'Standings are fetched for this competition.',
			}),
			defineField({
				name: 'highlightTeamId',
				title: 'Highlight team',
				type: 'reference',
				to: [{ type: 'sports.team' }],
				description: 'This team row will be highlighted in the table.',
			}),
		],
		preview: {
			select: { comp: 'competitionId.title' },
			prepare: ({ comp }) => ({ title: 'League standings', subtitle: comp }),
		},
	}),
)
