import { defineField, defineType } from 'sanity'
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe'

export default defineType({
	name: 'sports.stakeholder',
	title: 'Sports stakeholder',
	type: 'document',
	icon: EarthGlobeIcon,
	groups: [{ name: 'relationship', default: true }, { name: 'recognition' }],
	fields: [
		defineField({
			name: 'organization',
			type: 'string',
			group: 'relationship',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'donorType',
			title: 'Donor type',
			type: 'string',
			options: {
				list: [
					{ title: 'Individual', value: 'individual' },
					{ title: 'Organisation', value: 'organisation' },
				],
				layout: 'radio',
			},
			initialValue: 'organisation',
			group: 'relationship',
		}),
		defineField({
			name: 'organizationType',
			type: 'string',
			options: {
				list: [
					{ title: 'School', value: 'school' },
					{ title: 'Community organization', value: 'community' },
					{ title: 'Football association', value: 'association' },
					{ title: 'Local government', value: 'government' },
					{ title: 'Funder', value: 'funder' },
					{ title: 'Service partner', value: 'service-partner' },
					{ title: 'Other', value: 'other' },
				],
			},
			group: 'relationship',
			hidden: ({ parent }) => parent?.donorType === 'individual',
		}),
		defineField({
			name: 'donationPurpose',
			title: 'Donation purpose',
			type: 'string',
			description: 'e.g. Competition registration fees, kit, transport',
			group: 'relationship',
		}),
		defineField({
			name: 'relationshipLead',
			title: 'Relationship lead',
			type: 'string',
			options: {
				list: [
					{ title: 'Unami Foundation', value: 'foundation' },
					{ title: 'Team', value: 'team' },
					{ title: 'Joint', value: 'joint' },
				],
			},
			initialValue: 'foundation',
			group: 'relationship',
			description:
				'Workflow label only; it does not enforce document access. Configure Sanity roles separately.',
		}),
		defineField({
			name: 'supportAreas',
			type: 'array',
			of: [{ type: 'string' }],
			options: { layout: 'tags' },
			group: 'relationship',
		}),
		defineField({
			name: 'relationshipSummary',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'relationship',
		}),
		defineField({
			name: 'website',
			type: 'url',
			group: 'relationship',
			hidden: ({ parent }) => parent?.donorType === 'individual',
		}),
		defineField({
			name: 'isPrivate',
			title: 'Keep identity private',
			type: 'boolean',
			initialValue: false,
			group: 'recognition',
			description:
				'For individual donors who wish to remain anonymous. Their name will never appear publicly.',
		}),
		defineField({
			name: 'acknowledgementLabel',
			title: 'Public acknowledgement label',
			type: 'string',
			group: 'recognition',
			description: 'Shown publicly instead of the name when private. e.g. "A community supporter"',
			hidden: ({ parent }) => !parent?.isPrivate,
			validation: (Rule) =>
				Rule.custom((value, ctx: any) => {
					if (ctx.document?.isPrivate && ctx.document?.publicAcknowledgement && !value)
						return 'Required when identity is private and public acknowledgement is on.'
					return true
				}),
		}),
		defineField({
			name: 'publicAcknowledgement',
			title: 'Approved for public acknowledgement',
			type: 'boolean',
			initialValue: false,
			group: 'recognition',
			description:
				'Obtain written approval before publishing. For private donors, only the label above will appear.',
		}),
		defineField({
			name: 'publicAcknowledgementText',
			type: 'string',
			group: 'recognition',
			hidden: ({ parent }) => !parent?.publicAcknowledgement,
		}),
	],
	preview: {
		select: { title: 'organization', type: 'organizationType', donorType: 'donorType' },
		prepare: ({ title, type, donorType }) => ({
			title,
			subtitle: donorType === 'individual' ? 'Individual donor' : (type ? type.replaceAll('-', ' ') : undefined),
		}),
	},
})
