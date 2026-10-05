import { defineField, defineType } from 'sanity'
import { BillIcon } from '@sanity/icons/Bill'

export default defineType({
	name: 'sports.governance',
	title: 'Sports governance document',
	type: 'document',
	icon: BillIcon,
	groups: [{ name: 'document', default: true }, { name: 'review' }],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'document',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'documentType',
			title: 'Document type',
			type: 'string',
			options: {
				list: [
					{ title: 'Club constitution starter', value: 'constitution' },
					{ title: 'Safeguarding policy', value: 'safeguarding' },
					{ title: 'Code of conduct', value: 'code-of-conduct' },
					{ title: 'Finance and controls', value: 'finance' },
					{ title: 'Privacy and data handling', value: 'privacy' },
					{ title: 'Stakeholder agreement', value: 'stakeholder-agreement' },
					{ title: 'Other', value: 'other' },
				],
			},
			group: 'document',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'team',
			type: 'reference',
			to: [{ type: 'sports.team' }],
			group: 'document',
		}),
		defineField({
			name: 'owner',
			type: 'string',
			options: {
				list: [
					{ title: 'Team', value: 'team' },
					{ title: 'Unami Foundation', value: 'foundation' },
					{ title: 'Joint', value: 'joint' },
				],
			},
			initialValue: 'joint',
			group: 'review',
			description:
				'Operational responsibility only; Sanity access permissions are configured separately.',
		}),
		defineField({
			name: 'status',
			type: 'string',
			options: {
				list: [
					{ title: 'Working draft', value: 'draft' },
					{ title: 'Under review', value: 'review' },
					{ title: 'Approved by organization', value: 'approved' },
					{ title: 'Superseded', value: 'superseded' },
				],
			},
			initialValue: 'draft',
			group: 'review',
		}),
		defineField({
			name: 'version',
			type: 'string',
			initialValue: '0.1-draft',
			group: 'review',
		}),
		defineField({
			name: 'effectiveDate',
			type: 'date',
			group: 'review',
		}),
		defineField({
			name: 'reviewDate',
			type: 'date',
			group: 'review',
		}),
		defineField({
			name: 'reviewNote',
			type: 'text',
			rows: 3,
			initialValue:
				'Starter template only. Adapt to the organization and obtain appropriate South African legal and football-association review before adoption.',
			group: 'review',
		}),
		defineField({
			name: 'content',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'document',
		}),
	],
	preview: {
		select: { title: 'title', status: 'status', version: 'version' },
		prepare: ({ title, status, version }) => ({
			title,
			subtitle: [status, version].filter(Boolean).join(' · '),
		}),
	},
})
