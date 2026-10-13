import defineModule from '@/sanity/schemaTypes/fragments/define-module'
import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons/User'

export default defineModule(
	defineType({
		name: 'sports.players',
		title: 'Players list',
		type: 'object',
		icon: UserIcon,
		fields: [
			defineField({ name: 'eyebrow', type: 'string' }),
			defineField({
				name: 'teamId',
				title: 'Team',
				type: 'reference',
				to: [{ type: 'sports.team' }],
				description: 'Players are fetched live for this team.',
			}),
		],
		preview: {
			select: { team: 'teamId.title' },
			prepare: ({ team }) => ({ title: 'Players list', subtitle: team }),
		},
	}),
)
