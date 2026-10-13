import defineModule from '@/sanity/schemaTypes/fragments/define-module'
import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'

export default defineModule(
	defineType({
		name: 'sports.events',
		title: 'Events list',
		type: 'object',
		icon: CalendarIcon,
		fields: [
			defineField({ name: 'eyebrow', type: 'string' }),
			defineField({
				name: 'teamId',
				title: 'Team',
				type: 'reference',
				to: [{ type: 'sports.team' }],
				description: 'Events are fetched live for this team.',
			}),
		],
		preview: {
			select: { team: 'teamId.title' },
			prepare: ({ team }) => ({ title: 'Events list', subtitle: team }),
		},
	}),
)
