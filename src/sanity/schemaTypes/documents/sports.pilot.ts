import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons/Rocket'

export default defineType({
	name: 'sports.pilot',
	title: 'Sports team pilot',
	type: 'document',
	icon: RocketIcon,
	groups: [
		{ name: 'discovery', default: true },
		{ name: 'readiness' },
		{ name: 'delivery' },
		{ name: 'review' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'discovery',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'team',
			type: 'reference',
			to: [{ type: 'sports.team' }],
			group: 'discovery',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'cohort',
			type: 'string',
			description: 'Programme cohort label, not a public team claim.',
			group: 'discovery',
		}),
		defineField({
			name: 'stage',
			type: 'string',
			options: {
				list: [
					{ title: 'Invited', value: 'invited' },
					{ title: 'Discovery', value: 'discovery' },
					{ title: 'Agreement in progress', value: 'agreement' },
					{ title: 'Readiness review', value: 'readiness' },
					{ title: 'Active pilot', value: 'active' },
					{ title: 'Review', value: 'review' },
					{ title: 'Completed', value: 'completed' },
					{ title: 'Paused', value: 'paused' },
					{ title: 'Exited', value: 'exited' },
				],
			},
			initialValue: 'invited',
			group: 'delivery',
			validation: (Rule) =>
				Rule.custom((value, context) => {
					if (!['active', 'review', 'completed'].includes(String(value)))
						return true
					const doc = context.document
					if (
						!doc?.participationApproved ||
						!doc?.supportScopeAgreed ||
						!doc?.safeguardingPlanAgreed ||
						!doc?.accessRolesTested
					) {
						return 'Before activation, confirm participation, support scope, safeguarding arrangements and tested access roles.'
					}
					return true
				}),
		}),
		defineField({
			name: 'teamRepresentativeRole',
			title: 'Authorised team representative role',
			type: 'string',
			description:
				'Record an organisational role, not personal contact details.',
			group: 'discovery',
		}),
		defineField({
			name: 'foundationOwnerRole',
			title: 'Foundation programme owner role',
			type: 'string',
			description: 'Record a role, not credentials or private contact details.',
			group: 'discovery',
		}),
		defineField({
			name: 'need',
			title: 'Team-stated need and pilot objective',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'discovery',
		}),
		defineField({
			name: 'servicesAgreed',
			type: 'array',
			of: [{ type: 'string' }],
			options: { layout: 'tags' },
			group: 'delivery',
		}),
		defineField({
			name: 'participationApproved',
			title: 'Participation approved by team',
			type: 'boolean',
			initialValue: false,
			group: 'readiness',
		}),
		defineField({
			name: 'supportScopeAgreed',
			title: 'Support scope and boundaries agreed',
			type: 'boolean',
			initialValue: false,
			group: 'readiness',
		}),
		defineField({
			name: 'safeguardingPlanAgreed',
			title: 'Safeguarding plan and escalation route agreed',
			type: 'boolean',
			initialValue: false,
			group: 'readiness',
		}),
		defineField({
			name: 'accessRolesTested',
			title: 'Least-privilege access roles tested',
			type: 'boolean',
			initialValue: false,
			group: 'readiness',
			description:
				'Do not mark complete based on ownership labels; test real Sanity access permissions.',
		}),
		defineField({
			name: 'primaryEditorTrained',
			title: 'Primary team editor trained',
			type: 'boolean',
			initialValue: false,
			group: 'readiness',
		}),
		defineField({
			name: 'backupEditorTrained',
			title: 'Backup team editor trained',
			type: 'boolean',
			initialValue: false,
			group: 'readiness',
		}),
		defineField({
			name: 'startDate',
			type: 'date',
			group: 'delivery',
		}),
		defineField({
			name: 'reviewDate',
			type: 'date',
			group: 'review',
		}),
		defineField({
			name: 'decision',
			type: 'string',
			options: {
				list: [
					{ title: 'Continue', value: 'continue' },
					{ title: 'Change scope', value: 'change' },
					{ title: 'Expand carefully', value: 'expand' },
					{ title: 'Pause', value: 'pause' },
					{ title: 'Exit and transition', value: 'exit' },
				],
			},
			group: 'review',
		}),
		defineField({
			name: 'reviewNotes',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'review',
		}),
		defineField({
			name: 'demoRecord',
			title: 'Demonstration record',
			type: 'boolean',
			initialValue: false,
			group: 'review',
		}),
	],
	preview: {
		select: { title: 'title', team: 'team.title', stage: 'stage' },
		prepare: ({ title, team, stage }) => ({
			title,
			subtitle: [team, stage].filter(Boolean).join(' · '),
		}),
	},
})
