import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'

export default defineType({
	name: 'sports.event',
	title: 'Sports event',
	type: 'document',
	icon: CalendarIcon,
	groups: [
		{ name: 'event', default: true },
		{ name: 'delivery' },
		{ name: 'safety' },
		{ name: 'finance' },
		{ name: 'review' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'event',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'competition',
			type: 'reference',
			to: [{ type: 'sports.competition' }],
			group: 'event',
		}),
		defineField({
			name: 'teams',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'sports.team' }] }],
			group: 'event',
		}),
		defineField({
			name: 'status',
			type: 'string',
			options: {
				list: [
					{ title: 'Proposed', value: 'proposed' },
					{ title: 'Readiness review', value: 'readiness' },
					{ title: 'Approved to announce', value: 'approved' },
					{ title: 'Scheduled', value: 'scheduled' },
					{ title: 'Delivered', value: 'delivered' },
					{ title: 'Cancelled', value: 'cancelled' },
					{ title: 'Review complete', value: 'reviewed' },
				],
			},
			initialValue: 'proposed',
			group: 'delivery',
			validation: (Rule) =>
				Rule.custom((value, context) => {
					if (!['approved', 'scheduled', 'delivered'].includes(String(value)))
						return true
					const doc = context.document
					if (
						!doc?.teamApprovalsComplete ||
						!doc?.venueConfirmed ||
						!doc?.safetyPlanApproved ||
						!doc?.firstAidConfirmed ||
						!doc?.eventBudgetApproved ||
						!doc?.authorityChecksComplete
					) {
						return 'Before public announcement or delivery, confirm team approvals, venue, safety plan, first aid, approved budget and relevant authority checks.'
					}
					return true
				}),
		}),
		defineField({
			name: 'eventLeadRole',
			type: 'string',
			group: 'delivery',
		}),
		defineField({
			name: 'startDateTime',
			type: 'datetime',
			group: 'event',
		}),
		defineField({
			name: 'endDateTime',
			type: 'datetime',
			group: 'event',
		}),
		defineField({
			name: 'publicVenueName',
			title: 'Approved public venue name',
			type: 'string',
			group: 'event',
			description:
				'Never enter a child’s home address or private travel details.',
		}),
		defineField({
			name: 'venueConfirmed',
			type: 'boolean',
			initialValue: false,
			group: 'safety',
		}),
		defineField({
			name: 'teamApprovalsComplete',
			type: 'boolean',
			initialValue: false,
			group: 'safety',
		}),
		defineField({
			name: 'authorityChecksComplete',
			type: 'boolean',
			initialValue: false,
			group: 'safety',
		}),
		defineField({
			name: 'safetyPlanApproved',
			type: 'boolean',
			initialValue: false,
			group: 'safety',
		}),
		defineField({
			name: 'firstAidConfirmed',
			type: 'boolean',
			initialValue: false,
			group: 'safety',
		}),
		defineField({
			name: 'transportPlanApproved',
			type: 'boolean',
			initialValue: false,
			group: 'safety',
		}),
		defineField({
			name: 'budget',
			type: 'reference',
			to: [{ type: 'sports.resource' }],
			group: 'finance',
			description: 'Reference an approved planning record; not a bank ledger.',
		}),
		defineField({
			name: 'eventBudgetApproved',
			type: 'boolean',
			initialValue: false,
			group: 'finance',
		}),
		defineField({
			name: 'cancellationPlan',
			type: 'text',
			rows: 3,
			group: 'safety',
		}),
		defineField({
			name: 'publicListing',
			title: 'Publish event listing',
			type: 'boolean',
			initialValue: false,
			group: 'review',
			validation: (Rule) =>
				Rule.custom((value, context) => {
					if (!value) return true
					const doc = context.document
					if (
						!['approved', 'scheduled', 'delivered'].includes(
							String(doc?.status),
						) ||
						!doc?.teamApprovalsComplete ||
						!doc?.venueConfirmed ||
						!doc?.safetyPlanApproved ||
						!doc?.firstAidConfirmed ||
						!doc?.eventBudgetApproved ||
						!doc?.authorityChecksComplete
					) {
						return 'Public listing requires an approved event with team approvals, confirmed venue, safety plan, first aid, budget and authority checks.'
					}
					return true
				}),
		}),
		defineField({
			name: 'teamFeedbackSummary',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'review',
			description: 'Summarise feedback; do not include sensitive case details.',
		}),
		defineField({
			name: 'actualCostReviewComplete',
			type: 'boolean',
			initialValue: false,
			group: 'review',
		}),
		defineField({
			name: 'demoRecord',
			type: 'boolean',
			initialValue: false,
			group: 'review',
		}),
	],
	preview: {
		select: { title: 'title', status: 'status', date: 'startDateTime' },
		prepare: ({ title, status, date }) => ({
			title,
			subtitle: [date, status].filter(Boolean).join(' · '),
		}),
	},
})
