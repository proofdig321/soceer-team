import { defineField, defineType } from 'sanity'
import { SparklesIcon } from '@sanity/icons/Sparkles'

export default defineType({
	name: 'sports.talent',
	title: 'Talent pathway review',
	type: 'document',
	icon: SparklesIcon,
	groups: [
		{ name: 'pathway', default: true },
		{ name: 'consent' },
		{ name: 'representation gate' },
		{ name: 'review' },
	],
	fields: [
		defineField({
			name: 'referenceCode',
			title: 'Pseudonymous reference code',
			type: 'string',
			group: 'pathway',
			validation: (Rule) => Rule.required(),
			description:
				'Do not store participant names, contact details, school, medical or location data in this workflow record.',
		}),
		defineField({
			name: 'team',
			type: 'reference',
			to: [{ type: 'sports.team' }],
			group: 'pathway',
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
			group: 'pathway',
		}),
		defineField({
			name: 'pathwayType',
			type: 'string',
			options: {
				list: [
					{ title: 'Skills and development support', value: 'development' },
					{ title: 'Opportunity information', value: 'information' },
					{ title: 'Consent-based referral', value: 'referral' },
					{ title: 'Talent showcase', value: 'showcase' },
					{
						title: 'Formal representation (restricted; legal gate)',
						value: 'representation',
					},
				],
			},
			group: 'pathway',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'ageBand',
			type: 'string',
			options: {
				list: [
					{ title: 'Under 18', value: 'under-18' },
					{ title: '18 or older', value: 'adult' },
					{ title: 'Not recorded', value: 'not-recorded' },
				],
			},
			initialValue: 'not-recorded',
			group: 'consent',
			description: 'Do not record date of birth.',
		}),
		defineField({
			name: 'status',
			type: 'string',
			options: {
				list: [
					{ title: 'Idea only', value: 'idea' },
					{ title: 'Consent-based discussion', value: 'discussion' },
					{ title: 'Safeguarding and authority review', value: 'review' },
					{ title: 'Approved development/referral only', value: 'approved' },
					{ title: 'Closed', value: 'closed' },
				],
			},
			initialValue: 'idea',
			group: 'review',
			validation: (Rule) =>
				Rule.custom((value, context) => {
					const doc = context.document
					if (
						doc?.pathwayType === 'representation' &&
						!['idea', 'closed'].includes(String(value))
					) {
						return 'Formal representation is not enabled by this CMS workflow. Obtain specialist legal/sport-rule approval and build a separate authorised process first.'
					}
					if (
						!['idea', 'closed'].includes(String(value)) &&
						(!doc?.participantOptIn ||
							(doc?.ageBand === 'under-18' &&
								(!doc?.guardianProcessConfirmed ||
									!doc?.ageAppropriateAssentConfirmed)))
					) {
						return 'Progress requires participant opt-in and, for under-18s, the agreed guardian process and age-appropriate assent.'
					}
					return true
				}),
		}),
		defineField({
			name: 'participantOptIn',
			title: 'Participant has opted into this pathway',
			type: 'boolean',
			initialValue: false,
			group: 'consent',
		}),
		defineField({
			name: 'guardianProcessConfirmed',
			title: 'Appropriate guardian process confirmed',
			type: 'boolean',
			initialValue: false,
			group: 'consent',
		}),
		defineField({
			name: 'ageAppropriateAssentConfirmed',
			title: 'Age-appropriate assent confirmed',
			type: 'boolean',
			initialValue: false,
			group: 'consent',
		}),
		defineField({
			name: 'purposeAndDataExplained',
			title: 'Purpose, audience and data use explained',
			type: 'boolean',
			initialValue: false,
			group: 'consent',
		}),
		defineField({
			name: 'safeguardingReviewComplete',
			title: 'Safeguarding review complete',
			type: 'boolean',
			initialValue: false,
			group: 'review',
		}),
		defineField({
			name: 'conflictReviewComplete',
			title: 'Conflict of interest review complete',
			type: 'boolean',
			initialValue: false,
			group: 'review',
		}),
		defineField({
			name: 'formalRepresentationGate',
			title: 'Formal representation authority review',
			type: 'object',
			group: 'representation gate',
			description:
				'Checklist only; it does not authorise agency, confirm registration, or replace independent legal/sport-governance review.',
			fields: [
				{
					name: 'specialistAdviceReceived',
					type: 'boolean',
					initialValue: false,
				},
				{
					name: 'applicableRulesVerified',
					type: 'boolean',
					initialValue: false,
				},
				{
					name: 'authorisedEntityConfirmed',
					type: 'boolean',
					initialValue: false,
				},
				{
					name: 'conflictsAndFeesReviewed',
					type: 'boolean',
					initialValue: false,
				},
			],
		}),
		defineField({
			name: 'reviewOwnerRole',
			type: 'string',
			group: 'review',
		}),
		defineField({
			name: 'reviewDate',
			type: 'date',
			group: 'review',
		}),
		defineField({
			name: 'nonSensitiveNotes',
			type: 'text',
			rows: 3,
			group: 'review',
			description:
				'Record only pathway decisions. No case notes, scouting dossiers, health, school, location or contract details.',
		}),
		defineField({
			name: 'demoRecord',
			type: 'boolean',
			initialValue: false,
			group: 'review',
		}),
	],
	preview: {
		select: { title: 'referenceCode', sport: 'sport', status: 'status' },
		prepare: ({ title, sport, status }) => ({
			title: title || 'Talent pathway review',
			subtitle: [sport, status].filter(Boolean).join(' · '),
		}),
	},
})
