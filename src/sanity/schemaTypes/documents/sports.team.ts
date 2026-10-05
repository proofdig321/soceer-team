import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons/Users'

const sports = [
	{ title: 'Football / soccer', value: 'football' },
	{ title: 'Rugby', value: 'rugby' },
	{ title: 'Basketball', value: 'basketball' },
	{ title: 'Tennis', value: 'tennis' },
	{ title: 'Netball', value: 'netball' },
	{ title: 'Cricket', value: 'cricket' },
	{ title: 'Athletics', value: 'athletics' },
	{ title: 'Other', value: 'other' },
]

export default defineType({
	name: 'sports.team',
	title: 'Sports team',
	type: 'document',
	icon: UsersIcon,
	groups: [
		{ name: 'identity', default: true },
		{ name: 'operations' },
		{ name: 'publishing' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'identity',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title' },
			group: 'identity',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'sport',
			type: 'string',
			options: { list: sports },
			group: 'identity',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'identity',
		}),
		defineField({
			name: 'season',
			type: 'string',
			group: 'operations',
		}),
		defineField({
			name: 'ageGroup',
			type: 'string',
			description: 'Use a broad squad band; do not store dates of birth here.',
			group: 'operations',
		}),
		defineField({
			name: 'community',
			type: 'string',
			description:
				'Village, town, or municipality; do not enter a home address.',
			group: 'identity',
		}),
		defineField({
			name: 'province',
			type: 'string',
			group: 'identity',
		}),
		defineField({
			name: 'operationalOwner',
			title: 'Operational owner',
			type: 'string',
			options: {
				list: [
					{ title: 'Team', value: 'team' },
					{ title: 'Unami Foundation', value: 'foundation' },
					{ title: 'Joint', value: 'joint' },
				],
			},
			initialValue: 'team',
			group: 'operations',
			description:
				'Workflow label only; it does not enforce document access. Configure Sanity roles separately.',
		}),
		defineField({
			name: 'status',
			type: 'string',
			options: {
				list: [
					{ title: 'Onboarding', value: 'onboarding' },
					{ title: 'Active', value: 'active' },
					{ title: 'Paused', value: 'paused' },
					{ title: 'Demonstration only', value: 'demo' },
				],
			},
			initialValue: 'onboarding',
			group: 'operations',
		}),
		defineField({
			name: 'demoRecord',
			title: 'Demonstration record',
			type: 'boolean',
			initialValue: false,
			group: 'operations',
		}),
		defineField({
			name: 'publicProfile',
			title: 'Publish team profile',
			type: 'boolean',
			initialValue: false,
			group: 'publishing',
		}),
	],
	preview: {
		select: { title: 'title', sport: 'sport', community: 'community' },
		prepare: ({ title, sport, community }) => ({
			title,
			subtitle: [sport, community].filter(Boolean).join(' · '),
		}),
	},
})
