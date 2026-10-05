import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons/Users'

export default defineType({
	name: 'sports.commercial',
	title: 'Commercial and partnership agreement',
	type: 'document',
	icon: UsersIcon,
	groups: [
		{ name: 'relationship', default: true },
		{ name: 'deliverables' },
		{ name: 'approvals' },
		{ name: 'review' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'relationship',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'arrangementType',
			type: 'string',
			options: {
				list: [
					{ title: 'Sponsorship', value: 'sponsorship' },
					{ title: 'Grant', value: 'grant' },
					{ title: 'Donation', value: 'donation' },
					{ title: 'Service / earned income', value: 'service' },
					{ title: 'In-kind support', value: 'in-kind' },
					{ title: 'Event vendor', value: 'vendor' },
					{ title: 'Talent-related proposal', value: 'talent' },
					{ title: 'Other', value: 'other' },
				],
			},
			group: 'relationship',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'stakeholder',
			type: 'reference',
			to: [{ type: 'sports.stakeholder' }],
			group: 'relationship',
		}),
		defineField({
			name: 'team',
			type: 'reference',
			to: [{ type: 'sports.team' }],
			group: 'relationship',
		}),
		defineField({
			name: 'status',
			type: 'string',
			options: {
				list: [
					{ title: 'Exploratory only', value: 'exploratory' },
					{ title: 'Drafting terms', value: 'draft' },
					{ title: 'Review and approval', value: 'review' },
					{ title: 'Approved to sign', value: 'approved' },
					{ title: 'Active', value: 'active' },
					{ title: 'Completed', value: 'completed' },
					{ title: 'Declined / ended', value: 'ended' },
				],
			},
			initialValue: 'exploratory',
			group: 'approvals',
			validation: (Rule) =>
				Rule.custom((value, context) => {
					if (!['approved', 'active'].includes(String(value))) return true
					const doc = context.document
					if (
						!doc?.writtenTermsReviewed ||
						!doc?.conflictReviewComplete ||
						!doc?.benefitAndCostApproved ||
						(doc?.publicRecognitionRequested &&
							!doc?.recognitionConsentRecorded)
					) {
						return 'Approval requires reviewed written terms, conflict review, approved benefits/costs and permission for any public recognition.'
					}
					return true
				}),
		}),
		defineField({
			name: 'purpose',
			type: 'text',
			rows: 4,
			group: 'relationship',
		}),
		defineField({
			name: 'deliverables',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'deliverables',
			description:
				'List explicit, proportionate deliverables. Never promise access to children, selection influence, personal data or editorial control.',
		}),
		defineField({
			name: 'valueSummary',
			type: 'string',
			group: 'deliverables',
			description:
				'High-level planning summary only; record amounts and restrictions in the resource workflow.',
		}),
		defineField({
			name: 'writtenTermsReviewed',
			type: 'boolean',
			initialValue: false,
			group: 'approvals',
		}),
		defineField({
			name: 'conflictReviewComplete',
			type: 'boolean',
			initialValue: false,
			group: 'approvals',
		}),
		defineField({
			name: 'benefitAndCostApproved',
			type: 'boolean',
			initialValue: false,
			group: 'approvals',
		}),
		defineField({
			name: 'publicRecognitionRequested',
			type: 'boolean',
			initialValue: false,
			group: 'approvals',
		}),
		defineField({
			name: 'recognitionConsentRecorded',
			type: 'boolean',
			initialValue: false,
			group: 'approvals',
		}),
		defineField({
			name: 'approvingAuthorityRole',
			type: 'string',
			group: 'approvals',
		}),
		defineField({
			name: 'startDate',
			type: 'date',
			group: 'review',
		}),
		defineField({
			name: 'endDate',
			type: 'date',
			group: 'review',
		}),
		defineField({
			name: 'reviewDate',
			type: 'date',
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
		select: {
			title: 'title',
			type: 'arrangementType',
			status: 'status',
			stakeholder: 'stakeholder.organization',
		},
		prepare: ({ title, type, status, stakeholder }) => ({
			title,
			subtitle: [stakeholder, type, status].filter(Boolean).join(' · '),
		}),
	},
})
