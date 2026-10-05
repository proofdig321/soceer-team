import { defineField, defineType } from 'sanity'
import { WrenchIcon } from '@sanity/icons/Wrench'

export default defineType({
	name: 'sports.support',
	title: 'Platform support request',
	type: 'document',
	icon: WrenchIcon,
	groups: [
		{ name: 'request', default: true },
		{ name: 'triage' },
		{ name: 'resolution' },
	],
	fields: [
		defineField({
			name: 'reference',
			title: 'Request reference',
			type: 'string',
			description: 'Use an organisation-controlled non-personal reference.',
			group: 'request',
		}),
		defineField({
			name: 'title',
			type: 'string',
			group: 'request',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'team',
			type: 'reference',
			to: [{ type: 'sports.team' }],
			group: 'request',
		}),
		defineField({
			name: 'pilot',
			type: 'reference',
			to: [{ type: 'sports.pilot' }],
			group: 'request',
		}),
		defineField({
			name: 'category',
			type: 'string',
			options: {
				list: [
					{ title: 'Account access', value: 'account' },
					{ title: 'Content editing', value: 'content' },
					{ title: 'Publishing', value: 'publishing' },
					{ title: 'Technical issue', value: 'technical' },
					{ title: 'Maintenance', value: 'maintenance' },
					{ title: 'Accessibility', value: 'accessibility' },
					{ title: 'Training request', value: 'training' },
				],
			},
			group: 'request',
			description:
				'Not an emergency, safeguarding, incident-reporting or confidential case system.',
		}),
		defineField({
			name: 'description',
			type: 'text',
			rows: 5,
			group: 'request',
			description:
				'Describe the platform issue only. Never include passwords, child details, sensitive case notes or financial account data.',
			validation: (Rule) =>
				Rule.required()
					.max(1500)
					.warning(
						'Keep the report concise and minimise personal information.',
					),
		}),
		defineField({
			name: 'requesterRole',
			type: 'string',
			description: 'Record role/team, not private contact details.',
			group: 'request',
		}),
		defineField({
			name: 'priority',
			type: 'string',
			options: {
				list: [
					{ title: 'Routine', value: 'routine' },
					{ title: 'Time-sensitive', value: 'time-sensitive' },
					{ title: 'Service outage', value: 'outage' },
				],
			},
			initialValue: 'routine',
			group: 'triage',
		}),
		defineField({
			name: 'status',
			type: 'string',
			options: {
				list: [
					{ title: 'New', value: 'new' },
					{ title: 'Acknowledged', value: 'acknowledged' },
					{ title: 'In progress', value: 'in-progress' },
					{ title: 'Waiting for requester', value: 'waiting' },
					{ title: 'Resolved', value: 'resolved' },
					{ title: 'Closed', value: 'closed' },
				],
			},
			initialValue: 'new',
			group: 'triage',
		}),
		defineField({
			name: 'foundationOwnerRole',
			type: 'string',
			group: 'triage',
		}),
		defineField({
			name: 'receivedDate',
			type: 'date',
			group: 'triage',
		}),
		defineField({
			name: 'targetDate',
			type: 'date',
			group: 'triage',
		}),
		defineField({
			name: 'resolution',
			type: 'text',
			rows: 4,
			group: 'resolution',
			description:
				'Record actions taken without credentials or sensitive personal information.',
		}),
		defineField({
			name: 'resolvedDate',
			type: 'date',
			group: 'resolution',
		}),
	],
	preview: {
		select: { title: 'title', team: 'team.title', status: 'status' },
		prepare: ({ title, team, status }) => ({
			title,
			subtitle: [team, status].filter(Boolean).join(' · '),
		}),
	},
})
