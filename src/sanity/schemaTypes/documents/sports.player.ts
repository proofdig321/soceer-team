import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons/User'

export default defineType({
	name: 'sports.player',
	title: 'Sports player profile',
	type: 'document',
	icon: UserIcon,
	groups: [
		{ name: 'profile', default: true },
		{ name: 'safeguarding' },
		{ name: 'publishing' },
	],
	fields: [
		defineField({
			name: 'displayName',
			title: 'Display name',
			type: 'string',
			group: 'profile',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'team',
			type: 'reference',
			to: [{ type: 'sports.team' }],
			group: 'profile',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'squad',
			type: 'string',
			description: 'Use a broad age-group or squad label, not a date of birth.',
			group: 'profile',
		}),
		defineField({
			name: 'shirtNumber',
			type: 'number',
			validation: (Rule) => Rule.min(0).max(999),
			group: 'profile',
		}),
		defineField({
			name: 'position',
			type: 'string',
			description: 'Optional playing position or sporting role.',
			group: 'profile',
		}),
		defineField({
			name: 'introduction',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'profile',
		}),
		defineField({
			name: 'image',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [{ name: 'alt', type: 'string', title: 'Alternative text' }],
			group: 'safeguarding',
		}),
		defineField({
			name: 'guardianConsent',
			title: 'Guardian publication consent',
			type: 'string',
			options: {
				list: [
					{ title: 'Not requested', value: 'not-requested' },
					{ title: 'Pending', value: 'pending' },
					{ title: 'Approved', value: 'approved' },
					{ title: 'Declined / withdrawn', value: 'declined' },
				],
			},
			initialValue: 'not-requested',
			group: 'safeguarding',
		}),
		defineField({
			name: 'publicProfile',
			title: 'Publish profile',
			type: 'boolean',
			initialValue: false,
			group: 'publishing',
			description:
				'Keep off until appropriate guardian consent and safeguarding review are recorded.',
			validation: (Rule) =>
				Rule.custom((value, context) => {
					const document = context.document
					if (
						value &&
						document &&
						'guardianConsent' in document &&
						document.guardianConsent !== 'approved'
					) {
						return 'Guardian publication consent must be approved first.'
					}
					return true
				}),
		}),
		defineField({
			name: 'demoRecord',
			title: 'Demonstration record',
			type: 'boolean',
			initialValue: false,
			group: 'safeguarding',
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
			group: 'safeguarding',
			description:
				'Workflow label only; it does not enforce document access. Configure Sanity roles separately.',
		}),
	],
	preview: {
		select: {
			title: 'displayName',
			squad: 'squad',
			team: 'team.title',
			publicProfile: 'publicProfile',
		},
		prepare: ({ title, squad, team, publicProfile }) => ({
			title: title || 'Unnamed player profile',
			subtitle: [team, squad, publicProfile ? 'Public' : 'Private']
				.filter(Boolean)
				.join(' · '),
		}),
	},
})
