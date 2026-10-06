import { defineArrayMember, defineField } from 'sanity'
import { ThListIcon } from '@sanity/icons/ThList'
import { count } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'feature.bar',
	title: 'Feature bar',
	type: 'object',
	icon: ThListIcon,
	fields: [
		defineField({
			name: 'items',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({ name: 'label', type: 'string', validation: (Rule) => Rule.required() }),
						defineField({ name: 'description', type: 'string' }),
						defineField({
							name: 'icon',
							type: 'image',
							options: { metadata: ['lqip'] },
							fields: [defineField({ name: 'alt', type: 'string' })],
						}),
					],
					preview: {
						select: { title: 'label', subtitle: 'description' },
						prepare: ({ title, subtitle }) => ({ title, subtitle }),
					},
				}),
			],
			validation: (Rule) => Rule.min(2).max(6),
		}),
	],
	preview: {
		select: { items: 'items' },
		prepare: ({ items }) => ({
			title: count(items, 'feature'),
			subtitle: 'Feature bar',
		}),
	},
})
