import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'

export default defineType({
	name: 'sports.fixture',
	title: 'Sports fixture',
	type: 'document',
	icon: CalendarIcon,
	groups: [
		{ name: 'match', default: true },
		{ name: 'result' },
		{ name: 'publishing' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'match',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'team',
			type: 'reference',
			to: [{ type: 'sports.team' }],
			group: 'match',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'season',
			type: 'string',
			group: 'match',
		}),
		defineField({
			name: 'competition',
			type: 'string',
			group: 'match',
		}),
		defineField({
			name: 'opponent',
			type: 'string',
			group: 'match',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'kickoff',
			type: 'datetime',
			group: 'match',
		}),
		defineField({
			name: 'venue',
			type: 'string',
			description:
				'Publish only an approved public venue, never a private address.',
			group: 'match',
		}),
		defineField({
			name: 'status',
			type: 'string',
			options: {
				list: [
					{ title: 'Scheduled', value: 'scheduled' },
					{ title: 'Completed', value: 'completed' },
					{ title: 'Postponed', value: 'postponed' },
					{ title: 'Cancelled', value: 'cancelled' },
				],
			},
			initialValue: 'scheduled',
			group: 'result',
		}),
		defineField({
			name: 'homeScore',
			type: 'number',
			validation: (Rule) => Rule.min(0),
			group: 'result',
		}),
		defineField({
			name: 'awayScore',
			type: 'number',
			validation: (Rule) => Rule.min(0),
			group: 'result',
		}),
		defineField({
			name: 'matchReport',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'result',
		}),
		defineField({
			name: 'publicListing',
			title: 'Show on public site',
			type: 'boolean',
			initialValue: false,
			group: 'publishing',
			description:
				'When enabled, scheduled/completed fixtures for active public teams may appear in the public directory. Confirm team approval and travel safety first; venue and match report are not displayed publicly.',
		}),
		defineField({
			name: 'demoRecord',
			title: 'Demonstration record',
			type: 'boolean',
			initialValue: false,
			group: 'publishing',
		}),
		defineField({
			name: 'operationalOwner',
			title: 'Operational owner',
			type: 'string',
			options: {
				list: [
					{ title: 'Team', value: 'team' },
					{ title: 'Unami Foundation', value: 'foundation' },
					{ title: 'Joint', value: 'joint' },
				],
			},
			initialValue: 'team',
			group: 'match',
			description:
				'Workflow label only; it does not enforce document access. Configure Sanity roles separately.',
		}),
	],
	preview: {
		select: {
			title: 'title',
			kickoff: 'kickoff',
			status: 'status',
		},
		prepare: ({ title, kickoff, status }) => ({
			title,
			subtitle: [kickoff, status].filter(Boolean).join(' · '),
		}),
	},
})
