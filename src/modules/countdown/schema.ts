import { defineField } from 'sanity'
import { ClockIcon } from '@sanity/icons/Clock'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'countdown',
	title: 'Countdown',
	type: 'object',
	icon: ClockIcon,
	fields: [
		defineField({
			name: 'eyebrow',
			type: 'string',
		}),
		defineField({
			name: 'label',
			type: 'string',
			description: 'e.g. "Next match" or "Community Football Day"',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'targetDate',
			title: 'Target date and time',
			type: 'datetime',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
	],
	preview: {
		select: { label: 'label', date: 'targetDate' },
		prepare: ({ label, date }) => ({
			title: label || 'Countdown',
			subtitle: date ? `Target: ${date}` : 'Countdown',
		}),
	},
})
