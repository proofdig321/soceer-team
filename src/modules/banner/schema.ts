import { defineField } from 'sanity'
import { BellIcon } from '@sanity/icons/Bell'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'banner',
	title: 'Banner',
	type: 'object',
	icon: BellIcon,
	fields: [
		defineField({
			name: 'text',
			type: 'string',
			validation: (Rule) => Rule.required().max(160),
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({
			name: 'theme',
			type: 'string',
			options: {
				list: [
					{ title: 'Default (foreground)', value: 'default' },
					{ title: 'Action (primary)', value: 'action' },
					{ title: 'Highlight (amber)', value: 'highlight' },
					{ title: 'Subtle (muted)', value: 'subtle' },
				],
				layout: 'radio',
			},
			initialValue: 'default',
		}),
	],
	preview: {
		select: { text: 'text', theme: 'theme' },
		prepare: ({ text, theme }) => ({
			title: text || 'Banner',
			subtitle: `Banner · ${theme ?? 'default'}`,
		}),
	},
})
