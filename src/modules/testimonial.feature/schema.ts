import { defineField } from 'sanity'
import { BlockquoteIcon } from '@sanity/icons/Blockquote'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'testimonial.feature',
	title: 'Testimonial (featured)',
	type: 'object',
	icon: BlockquoteIcon,
	fields: [
		defineField({
			name: 'quote',
			type: 'text',
			rows: 4,
			validation: (Rule) => Rule.required().max(400),
		}),
		defineField({
			name: 'name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'role',
			type: 'string',
		}),
		defineField({
			name: 'image',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [defineField({ name: 'alt', type: 'string' })],
		}),
		defineField({
			name: 'backgroundImage',
			title: 'Background image (optional)',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [defineField({ name: 'alt', type: 'string' })],
		}),
	],
	preview: {
		select: { quote: 'quote', name: 'name', image: 'image' },
		prepare: ({ quote, name, image }) => ({
			title: name || 'Testimonial',
			subtitle: quote ? `"${quote.slice(0, 60)}…"` : 'Testimonial (featured)',
			media: image,
		}),
	},
})
