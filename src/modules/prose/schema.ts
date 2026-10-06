import { defineArrayMember, defineField } from 'sanity'
import { BlockContentIcon } from '@sanity/icons/BlockContent'
import { ImageIcon } from '@sanity/icons/Image'
import { PlayIcon } from '@sanity/icons/Play'
import { VscInspect } from 'react-icons/vsc'
import { count, getBlockText } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'prose',
	title: 'Prose',
	type: 'object',
	icon: BlockContentIcon,
	groups: [
		{ name: 'content', default: true },
		{ name: 'sidebar' },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'content',
			type: 'array',
			of: [
				{ type: 'block' },
				defineArrayMember({
					type: 'image',
					icon: ImageIcon,
					options: {
						hotspot: true,
						metadata: ['lqip'],
					},
					fields: [
						defineField({
							name: 'alt',
							type: 'string',
						}),
						defineField({
							name: 'figcaption',
							type: 'array',
							of: [
								{
									type: 'block',
									styles: [{ title: 'Normal', value: 'normal' }],
								},
							],
						}),
					],
				}),
				defineArrayMember({
					name: 'ctas',
					title: 'Call-to-actions',
					type: 'object',
					icon: VscInspect,
					fields: [
						defineField({
							name: 'ctas',
							title: 'Call-to-actions',
							type: 'array',
							of: [{ type: 'cta' }],
						}),
					],
					preview: {
						select: { ctas: 'ctas' },
						prepare: ({ ctas }) => ({
							title: count(ctas, 'CTA'),
							subtitle: 'Call-to-actions',
						}),
					},
				}),
				defineArrayMember({
					type: 'code',
					title: 'Code block',
					options: { withFilename: true },
				}),
				{ type: 'table' },
				{ type: 'custom-html' },
				defineArrayMember({
					name: 'videoEmbed',
					title: 'Video embed',
					type: 'object',
					icon: PlayIcon,
					fields: [
						defineField({ name: 'url', title: 'YouTube or Vimeo URL', type: 'url', validation: (Rule) => Rule.required() }),
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'caption', type: 'string' }),
					],
					preview: {
						select: { url: 'url', title: 'title' },
						prepare: ({ url, title }) => ({ title: title || url || 'Video', subtitle: 'Video embed' }),
					},
				}),
			],
			group: 'content',
		}),
		defineField({
			name: 'sidebar',
			type: 'sidebar',
			group: 'sidebar',
		}),
	],
	preview: {
		select: {
			content: 'content',
		},
		prepare: ({ content }) => ({
			title: getBlockText(content),
			subtitle: 'Prose',
		}),
	},
})
