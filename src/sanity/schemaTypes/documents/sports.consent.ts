import { defineField, defineType } from 'sanity'
import { CheckmarkCircleIcon } from '@sanity/icons/CheckmarkCircle'

/**
 * Consent and agreement record.
 *
 * This document records THAT consent or an agreement exists and where the
 * physical/digital original is held. It does NOT store the document itself,
 * signatures, dates of birth, addresses, or any sensitive personal data.
 *
 * Physical documents must be held in the organisation's approved secure
 * records system (e.g. locked filing cabinet, Google Drive with restricted
 * access, SharePoint). Record the location reference here — not the content.
 *
 * This is an internal-only document. No field from this schema is ever
 * projected in a public GROQ query.
 */
export default defineType({
	name: 'sports.consent',
	title: 'Consent and agreement record',
	type: 'document',
	icon: CheckmarkCircleIcon,
	groups: [
		{ name: 'record', default: true },
		{ name: 'status' },
		{ name: 'storage' },
	],
	fields: [
		defineField({
			name: 'consentType',
			title: 'Consent / agreement type',
			type: 'string',
			group: 'record',
			options: {
				list: [
					{ title: 'Guardian publication consent (player profile)', value: 'guardian-publication' },
					{ title: 'Guardian photo and media consent', value: 'guardian-photo' },
					{ title: 'Guardian travel and away-fixture consent', value: 'guardian-travel' },
					{ title: 'Medical emergency contact authorisation', value: 'medical-emergency' },
					{ title: 'Data processing consent (POPIA)', value: 'data-processing' },
					{ title: 'Volunteer / coach code of conduct agreement', value: 'code-of-conduct' },
					{ title: 'Stakeholder / sponsor agreement', value: 'stakeholder-agreement' },
					{ title: 'Other', value: 'other' },
				],
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'player',
			type: 'reference',
			to: [{ type: 'sports.player' }],
			group: 'record',
			description: 'Link to the player profile this consent covers, if applicable.',
		}),
		defineField({
			name: 'team',
			type: 'reference',
			to: [{ type: 'sports.team' }],
			group: 'record',
		}),
		defineField({
			name: 'consentStatus',
			title: 'Status',
			type: 'string',
			group: 'status',
			options: {
				list: [
					{ title: 'Not yet requested', value: 'not-requested' },
					{ title: 'Requested — awaiting response', value: 'pending' },
					{ title: 'Granted', value: 'granted' },
					{ title: 'Declined', value: 'declined' },
					{ title: 'Withdrawn', value: 'withdrawn' },
					{ title: 'Expired — renewal required', value: 'expired' },
				],
			},
			initialValue: 'not-requested',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'consentedByRole',
			title: 'Consented by (role)',
			type: 'string',
			group: 'status',
			description:
				'Record the role only — e.g. "Parent / guardian", "Player (adult)", "Coach". Do not record full names here.',
		}),
		defineField({
			name: 'consentDate',
			title: 'Date consent granted',
			type: 'date',
			group: 'status',
		}),
		defineField({
			name: 'reviewDate',
			title: 'Review / renewal date',
			type: 'date',
			group: 'status',
			description: 'Set a reminder to re-confirm consent each season.',
		}),
		defineField({
			name: 'season',
			type: 'string',
			group: 'status',
			description: 'e.g. 2026',
		}),
		defineField({
			name: 'documentHeldAt',
			title: 'Physical / digital document location',
			type: 'string',
			group: 'storage',
			description:
				'Where is the signed original stored? e.g. "Team folder — Google Drive /Consents/2026" or "Locked filing cabinet — coach office". Do not paste links to restricted files here.',
		}),
		defineField({
			name: 'documentReference',
			title: 'Document reference code',
			type: 'string',
			group: 'storage',
			description:
				'An internal reference code that matches the physical file. e.g. "CON-2026-001". Never use the player\'s full name as a reference.',
		}),
		defineField({
			name: 'notes',
			type: 'text',
			rows: 3,
			group: 'storage',
			description:
				'Operational notes only. Do not record personal details, medical information, addresses, or financial data here.',
		}),
		defineField({
			name: 'recordedByRole',
			title: 'Recorded by (role)',
			type: 'string',
			group: 'storage',
			description: 'Role of the person who created this record. e.g. "Team administrator".',
		}),
	],
	preview: {
		select: {
			type: 'consentType',
			status: 'consentStatus',
			player: 'player.displayName',
			team: 'team.title',
			season: 'season',
		},
		prepare: ({ type, status, player, team, season }) => ({
			title: [type, player].filter(Boolean).join(' — '),
			subtitle: [team, season, status].filter(Boolean).join(' · '),
		}),
	},
})
