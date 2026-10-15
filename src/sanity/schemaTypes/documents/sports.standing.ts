import { defineField, defineType } from 'sanity'
import { TrendUpwardIcon } from '@sanity/icons/TrendUpward'

export default defineType({
	name: 'sports.standing',
	title: 'League standing',
	type: 'document',
	icon: TrendUpwardIcon,
	description: 'One row per team in a league table. Update after each round of fixtures.',
	groups: [
		{ name: 'standing', default: true },
		{ name: 'record' },
	],
	fields: [
		defineField({
			name: 'competition',
			type: 'reference',
			to: [{ type: 'sports.competition' }],
			group: 'standing',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'teamName',
			title: 'Team name',
			type: 'string',
			group: 'standing',
			description: 'Display name for this row. Does not need to be a registered team.',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'teamRef',
			title: 'Team (if registered)',
			type: 'reference',
			to: [{ type: 'sports.team' }],
			group: 'standing',
			description: 'Optional — links to a registered team for highlighting.',
		}),
		defineField({
			name: 'position',
			type: 'number',
			group: 'standing',
			validation: (Rule) => Rule.required().min(1),
		}),
		defineField({ name: 'played',       type: 'number', group: 'record', initialValue: 0, validation: (Rule) => Rule.min(0) }),
		defineField({ name: 'won',          type: 'number', group: 'record', initialValue: 0, validation: (Rule) => Rule.min(0) }),
		defineField({ name: 'drawn',        type: 'number', group: 'record', initialValue: 0, validation: (Rule) => Rule.min(0) }),
		defineField({ name: 'lost',         type: 'number', group: 'record', initialValue: 0, validation: (Rule) => Rule.min(0) }),
		defineField({ name: 'goalsFor',     title: 'Goals for',     type: 'number', group: 'record', initialValue: 0, validation: (Rule) => Rule.min(0) }),
		defineField({ name: 'goalsAgainst', title: 'Goals against', type: 'number', group: 'record', initialValue: 0, validation: (Rule) => Rule.min(0) }),
		defineField({ name: 'points',       type: 'number', group: 'record', initialValue: 0, validation: (Rule) => Rule.min(0) }),
		defineField({
			name: 'season',
			type: 'string',
			group: 'standing',
			description: 'e.g. 2026',
		}),
	],
	preview: {
		select: {
			pos: 'position',
			team: 'teamName',
			comp: 'competition.title',
			pts: 'points',
		},
		prepare: ({ pos, team, comp, pts }) => ({
			title: `${pos}. ${team}`,
			subtitle: [comp, pts != null ? `${pts} pts` : undefined].filter(Boolean).join(' · '),
		}),
	},
})
