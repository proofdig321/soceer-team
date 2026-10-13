import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule(
	defineType({
		name: 'sports.fixtures',
		title: 'Fixtures list',
		type: 'object',
		icon: CalendarIcon,
		fields: [
			defineField({ name: 'eyebrow', type: 'string' }),
			defineField({
				name: 'teamId',
				title: 'Team',
				type: 'reference',
				to: [{ type: 'sports.team' }],
				description: 'Fixtures are fetched live for this team.',
			}),
		],
		preview: {
			select: { team: 'teamId.title' },
			prepare: ({ team }) => ({ title: 'Fixtures list', subtitle: team }),
		},
	}),
)
