import { defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons/Book'

export default defineType({
	name: 'sports.training',
	title: 'Team training session',
	type: 'document',
	icon: BookIcon,
	groups: [
		{ name: 'session', default: true },
		{ name: 'learning' },
		{ name: 'followup' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'session',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'team',
			type: 'reference',
			to: [{ type: 'sports.team' }],
			group: 'session',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'pilot',
			type: 'reference',
			to: [{ type: 'sports.pilot' }],
			group: 'session',
		}),
		defineField({
			name: 'topic',
			type: 'string',
			options: {
				list: [
					{ title: 'Site and page editing', value: 'site-editing' },
					{ title: 'Fixtures and results', value: 'fixtures' },
					{ title: 'Publishing and approvals', value: 'publishing' },
					{ title: 'Privacy and safeguarding', value: 'safeguarding' },
					{ title: 'Administration and handover', value: 'administration' },
					{ title: 'Governance and finance', value: 'governance-finance' },
					{ title: 'Other', value: 'other' },
				],
			},
			group: 'session',
		}),
		defineField({
			name: 'deliveryMode',
			type: 'string',
			options: {
				list: [
					{ title: 'In person', value: 'in-person' },
					{ title: 'Remote', value: 'remote' },
					{ title: 'Printed/self-guided', value: 'self-guided' },
					{ title: 'Blended', value: 'blended' },
				],
			},
			group: 'session',
		}),
		defineField({
			name: 'sessionDate',
			type: 'date',
			group: 'session',
		}),
		defineField({
			name: 'facilitatorRole',
			type: 'string',
			description:
				'Use the facilitator’s role; avoid unnecessary personal data.',
			group: 'session',
		}),
		defineField({
			name: 'participantCount',
			title: 'Adult participant count',
			type: 'number',
			validation: (Rule) => Rule.min(0).integer(),
			group: 'learning',
		}),
		defineField({
			name: 'outcomes',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'learning',
		}),
		defineField({
			name: 'materials',
			type: 'array',
			of: [{ type: 'string' }],
			options: { layout: 'tags' },
			group: 'learning',
		}),
		defineField({
			name: 'followupOwnerRole',
			type: 'string',
			group: 'followup',
		}),
		defineField({
			name: 'followupDue',
			type: 'date',
			group: 'followup',
		}),
		defineField({
			name: 'followupStatus',
			type: 'string',
			options: {
				list: [
					{ title: 'Not required', value: 'not-required' },
					{ title: 'Open', value: 'open' },
					{ title: 'In progress', value: 'in-progress' },
					{ title: 'Complete', value: 'complete' },
				],
			},
			initialValue: 'open',
			group: 'followup',
		}),
		defineField({
			name: 'demoRecord',
			type: 'boolean',
			initialValue: false,
			group: 'followup',
		}),
	],
	preview: {
		select: { title: 'title', team: 'team.title', date: 'sessionDate' },
		prepare: ({ title, team, date }) => ({
			title,
			subtitle: [team, date].filter(Boolean).join(' · '),
		}),
	},
})
