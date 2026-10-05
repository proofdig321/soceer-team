import { defineField, defineType } from 'sanity'
import { CreditCardIcon } from '@sanity/icons/CreditCard'

export default defineType({
	name: 'sports.resource',
	title: 'Programme resource and budget line',
	type: 'document',
	icon: CreditCardIcon,
	groups: [
		{ name: 'resource', default: true },
		{ name: 'restriction' },
		{ name: 'approval' },
		{ name: 'reconciliation' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'resource',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'resourceType',
			type: 'string',
			options: {
				list: [
					{ title: 'Grant', value: 'grant' },
					{ title: 'Donation', value: 'donation' },
					{ title: 'Sponsorship', value: 'sponsorship' },
					{ title: 'Earned service income', value: 'earned-income' },
					{ title: 'Event income', value: 'event-income' },
					{ title: 'Team contribution', value: 'team-contribution' },
					{ title: 'Expense / cost estimate', value: 'expense' },
					{ title: 'In-kind contribution', value: 'in-kind' },
					{ title: 'Cross-subsidy allocation', value: 'cross-subsidy' },
				],
			},
			group: 'resource',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'recordStatus',
			title: 'Commitment status',
			type: 'string',
			options: {
				list: [
					{ title: 'Forecast only', value: 'forecast' },
					{ title: 'Proposed', value: 'proposed' },
					{ title: 'Approved', value: 'approved' },
					{ title: 'Confirmed in writing', value: 'confirmed' },
					{ title: 'Incurred / received', value: 'realised' },
					{ title: 'Reconciled', value: 'reconciled' },
					{ title: 'Cancelled', value: 'cancelled' },
				],
			},
			initialValue: 'forecast',
			group: 'approval',
		}),
		defineField({
			name: 'amount',
			type: 'number',
			validation: (Rule) => Rule.min(0),
			group: 'resource',
			description:
				'Planning/summary amount in ZAR. Not a payment instruction or accounting ledger.',
		}),
		defineField({
			name: 'currency',
			type: 'string',
			initialValue: 'ZAR',
			options: { list: [{ title: 'South African rand (ZAR)', value: 'ZAR' }] },
			group: 'resource',
		}),
		defineField({
			name: 'isConfirmedIncome',
			title: 'Written commitment confirmed',
			type: 'boolean',
			initialValue: false,
			group: 'approval',
			description:
				'Do not treat forecast, verbal interest or in-kind support as confirmed cash income.',
		}),
		defineField({
			name: 'sourceStakeholder',
			type: 'reference',
			to: [{ type: 'sports.stakeholder' }],
			group: 'resource',
		}),
		defineField({
			name: 'team',
			type: 'reference',
			to: [{ type: 'sports.team' }],
			group: 'resource',
		}),
		defineField({
			name: 'event',
			type: 'reference',
			to: [{ type: 'sports.event' }],
			group: 'resource',
		}),
		defineField({
			name: 'restrictionStatus',
			type: 'string',
			options: {
				list: [
					{ title: 'Unrestricted', value: 'unrestricted' },
					{ title: 'Restricted', value: 'restricted' },
					{ title: 'Pending terms', value: 'pending' },
					{ title: 'Not applicable (in-kind)', value: 'not-applicable' },
				],
			},
			initialValue: 'pending',
			group: 'restriction',
		}),
		defineField({
			name: 'restrictionSummary',
			type: 'text',
			rows: 3,
			group: 'restriction',
			description:
				'Summarise the purpose and conditions. Keep executed contracts in the approved secure records system.',
		}),
		defineField({
			name: 'restrictedPurposeApproved',
			title: 'Use checked against funding terms',
			type: 'boolean',
			initialValue: false,
			group: 'restriction',
		}),
		defineField({
			name: 'approvedByRole',
			type: 'string',
			group: 'approval',
		}),
		defineField({
			name: 'approvalDate',
			type: 'date',
			group: 'approval',
		}),
		defineField({
			name: 'financialOwnerRole',
			type: 'string',
			group: 'approval',
			description:
				'Role label only; does not confer access or replace separation of financial duties.',
		}),
		defineField({
			name: 'actualAmount',
			title: 'Reconciled actual amount',
			type: 'number',
			validation: (Rule) => Rule.min(0),
			group: 'reconciliation',
		}),
		defineField({
			name: 'reconciliationDate',
			type: 'date',
			group: 'reconciliation',
		}),
		defineField({
			name: 'reconciliationNote',
			type: 'text',
			rows: 3,
			group: 'reconciliation',
		}),
		defineField({
			name: 'demoRecord',
			type: 'boolean',
			initialValue: false,
			group: 'approval',
		}),
	],
	preview: {
		select: {
			title: 'title',
			type: 'resourceType',
			status: 'recordStatus',
			amount: 'amount',
		},
		prepare: ({ title, type, status, amount }) => ({
			title,
			subtitle: [type, status, amount == null ? undefined : `R ${amount}`]
				.filter(Boolean)
				.join(' · '),
		}),
	},
})
