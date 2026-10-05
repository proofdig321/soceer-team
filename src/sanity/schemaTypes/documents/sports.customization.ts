import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'

export default defineType({
	name: 'sports.customization',
	title: 'Sports platform customisation',
	type: 'document',
	icon: CogIcon,
	groups: [
		{ name: 'request', default: true },
		{ name: 'delivery' },
		{ name: 'review' },
	],
	fields: [
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
			group: 'request',
		}),
		defineField({
			name: 'area',
			title: 'Customisation area',
			type: 'string',
			options: {
				list: [
					{ title: 'Team identity and branding', value: 'branding' },
					{ title: 'Roster and participation', value: 'roster' },
					{ title: 'Fixtures and competitions', value: 'fixtures' },
					{ title: 'Training and development', value: 'development' },
					{ title: 'Stakeholder reporting', value: 'stakeholders' },
					{ title: 'Governance and safeguarding', value: 'governance' },
					{ title: 'Accessibility and language', value: 'accessibility' },
					{ title: 'Other', value: 'other' },
				],
			},
			group: 'request',
		}),
		defineField({
			name: 'request',
			title: 'Team need or request',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'request',
		}),
		defineField({
			name: 'teamApproval',
			title: 'Team decision',
			type: 'string',
			options: {
				list: [
					{ title: 'Not reviewed', value: 'pending' },
					{ title: 'Approved', value: 'approved' },
					{ title: 'Changes requested', value: 'changes-requested' },
					{ title: 'Declined', value: 'declined' },
				],
			},
			initialValue: 'pending',
			group: 'review',
		}),
		defineField({
			name: 'status',
			type: 'string',
			options: {
				list: [
					{ title: 'Proposed', value: 'proposed' },
					{ title: 'Approved for delivery', value: 'approved' },
					{ title: 'In progress', value: 'in-progress' },
					{ title: 'In service', value: 'in-service' },
					{ title: 'Deferred', value: 'deferred' },
					{ title: 'Declined', value: 'declined' },
				],
			},
			initialValue: 'proposed',
			group: 'delivery',
		}),
		defineField({
			name: 'foundationOwner',
			title: 'Foundation delivery owner',
			type: 'string',
			group: 'delivery',
			description:
				'Name a Foundation role, not a volunteer’s personal details. Sanity access permissions must be configured separately.',
		}),
		defineField({
			name: 'implementationNotes',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'delivery',
		}),
		defineField({
			name: 'reviewDate',
			type: 'date',
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
		select: { title: 'title', team: 'team.title', status: 'status' },
		prepare: ({ title, team, status }) => ({
			title,
			subtitle: [team, status].filter(Boolean).join(' · '),
		}),
	},
})
