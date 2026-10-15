import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons/Star'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule(
	defineType({
		name: 'sports.sponsors',
		title: 'Sponsors & supporters',
		type: 'object',
		icon: StarIcon,
		fields: [
			defineField({ name: 'eyebrow', type: 'string' }),
			defineField({ name: 'heading', type: 'string' }),
			defineField({
				name: 'teamId',
				title: 'Team',
				type: 'reference',
				to: [{ type: 'sports.team' }],
				description: 'Sponsors are fetched live for this team.',
			}),
		],
		preview: {
			select: { team: 'teamId.title' },
			prepare: ({ team }) => ({ title: 'Sponsors & supporters', subtitle: team }),
		},
	}),
)
