import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons/Star'

export default defineType({
	name: 'sports.competition',
	title: 'Sports competition',
	type: 'document',
	icon: StarIcon,
	groups: [
		{ name: 'competition', default: true },
		{ name: 'teams' },
		{ name: 'readiness' },
		{ name: 'governance' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'competition',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'sport',
			type: 'string',
			options: {
				list: [
					{ title: 'Football / soccer', value: 'football' },
					{ title: 'Rugby', value: 'rugby' },
					{ title: 'Basketball', value: 'basketball' },
					{ title: 'Tennis', value: 'tennis' },
					{ title: 'Netball', value: 'netball' },
					{ title: 'Cricket', value: 'cricket' },
					{ title: 'Athletics', value: 'athletics' },
					{ title: 'Other', value: 'other' },
				],
			},
			group: 'competition',
		}),
		defineField({
			name: 'format',
			type: 'string',
			options: {
				list: [
					{ title: 'One-off tournament', value: 'tournament' },
					{ title: 'Development league', value: 'league' },
					{ title: 'Festival / jamboree', value: 'festival' },
				],
			},
			group: 'competition',
		}),
		defineField({
			name: 'status',
			type: 'string',
			options: {
				list: [
					{ title: 'Concept', value: 'concept' },
					{ title: 'Feasibility', value: 'feasibility' },
					{ title: 'Approval pending', value: 'approval' },
					{ title: 'Approved', value: 'approved' },
					{ title: 'Active', value: 'active' },
					{ title: 'Completed', value: 'completed' },
					{ title: 'Paused', value: 'paused' },
					{ title: 'Cancelled', value: 'cancelled' },
				],
			},
			initialValue: 'concept',
			group: 'governance',
			validation: (Rule) =>
				Rule.custom((value, context) => {
					if (!['approved', 'active'].includes(String(value))) return true
					const doc = context.document
					if (
						!doc?.teamApprovalComplete ||
						!doc?.authorityChecksComplete ||
						!doc?.safeguardingPlanApproved ||
						!doc?.budgetApproved
					) {
						return 'Competition approval requires team approval, external authority checks, an approved safeguarding plan and an approved budget.'
					}
					return true
				}),
		}),
		defineField({
			name: 'teams',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'sports.team' }] }],
			group: 'teams',
		}),
		defineField({
			name: 'rulesSummary',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'governance',
			description:
				'Keep the approved competition rules in a controlled document and record its version here.',
		}),
		defineField({
			name: 'ruleVersion',
			type: 'string',
			group: 'governance',
		}),
		defineField({
			name: 'competitionOwnerRole',
			type: 'string',
			group: 'governance',
			description:
				'Name the accountable role; confirm mandate before operation.',
		}),
		defineField({
			name: 'teamApprovalComplete',
			title: 'Participating team approvals recorded',
			type: 'boolean',
			initialValue: false,
			group: 'readiness',
		}),
		defineField({
			name: 'authorityChecksComplete',
			title: 'Relevant association and venue checks completed',
			type: 'boolean',
			initialValue: false,
			group: 'readiness',
		}),
		defineField({
			name: 'safeguardingPlanApproved',
			title: 'Safeguarding and incident plan approved',
			type: 'boolean',
			initialValue: false,
			group: 'readiness',
		}),
		defineField({
			name: 'budgetApproved',
			title: 'Budget and funding plan approved',
			type: 'boolean',
			initialValue: false,
			group: 'readiness',
		}),
		defineField({
			name: 'financialResources',
			title: 'Related resource records',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'sports.resource' }] }],
			group: 'readiness',
		}),
		defineField({
			name: 'startDate',
			type: 'date',
			group: 'competition',
		}),
		defineField({
			name: 'endDate',
			type: 'date',
			group: 'competition',
		}),
		defineField({
			name: 'reviewDate',
			type: 'date',
			group: 'governance',
		}),
		defineField({
			name: 'publicAnnouncementApproved',
			type: 'boolean',
			initialValue: false,
			group: 'governance',
		}),
		defineField({
			name: 'demoRecord',
			type: 'boolean',
			initialValue: false,
			group: 'governance',
		}),
	],
	preview: {
		select: { title: 'title', format: 'format', status: 'status' },
		prepare: ({ title, format, status }) => ({
			title,
			subtitle: [format, status].filter(Boolean).join(' · '),
		}),
	},
})
