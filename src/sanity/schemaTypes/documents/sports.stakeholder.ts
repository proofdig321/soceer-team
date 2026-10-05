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
		}),
		defineField({
			name: 'publicAcknowledgement',
			title: 'Approved for public acknowledgement',
			type: 'boolean',
			initialValue: false,
			group: 'recognition',
			description:
				'Obtain written approval before publishing an organization name, logo, or endorsement.',
		}),
		defineField({
			name: 'publicAcknowledgementText',
			type: 'string',
			group: 'recognition',
			hidden: ({ parent }) => !parent?.publicAcknowledgement,
		}),
	],
	preview: {
		select: { title: 'organization', type: 'organizationType' },
		prepare: ({ title, type }) => ({
			title,
			subtitle: type ? type.replaceAll('-', ' ') : undefined,
		}),
	},
})
