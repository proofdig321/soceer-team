import defineModule from '@/sanity/schemaTypes/fragments/define-module'
import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'

export default defineModule(
	defineType({
		name: 'sports.next-fixture',
		title: 'Next fixture',
		type: 'object',
		icon: CalendarIcon,
		fields: [
			defineField({
				name: 'teamId',
				title: 'Team',
				type: 'reference',
				to: [{ type: 'sports.team' }],
				description: 'Fetches the next scheduled or live fixture for this team.',
			}),
		],
		preview: {
			select: { team: 'teamId.title' },
			prepare: ({ team }) => ({ title: 'Next fixture', subtitle: team }),
		},
	}),
)
