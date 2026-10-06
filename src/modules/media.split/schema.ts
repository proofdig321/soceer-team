import { defineField } from 'sanity'
import { TfiLayoutMediaLeft } from 'react-icons/tfi'
import { getBlockText } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'media.split',
	title: 'Media split',
	type: 'object',
	icon: TfiLayoutMediaLeft,
	groups: [
		{ name: 'content', default: true },
		{ name: 'media' },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'eyebrow',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'content',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'image',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [defineField({ name: 'alt', type: 'string' })],
			group: 'media',
		}),
		defineField({
			name: 'videoUrl',
			title: 'Video URL (YouTube / Vimeo) — overrides image',
			type: 'url',
			group: 'media',
		}),
		defineField({
			name: 'mediaOnRight',
			title: 'Media on right (desktop)',
			type: 'boolean',
			initialValue: false,
			group: 'options',
		}),
		defineField({
			name: 'mediaAspectRatio',
			title: 'Media aspect ratio',
			type: 'string',
			options: { list: ['16/9', '4/3', '1/1', '3/4'], layout: 'radio' },
			initialValue: '4/3',
			group: 'options',
		}),
	],
	preview: {
		select: { content: 'content', image: 'image' },
		prepare: ({ content, image }) => ({
			title: getBlockText(content),
			subtitle: 'Media split',
			media: image,
		}),
	},
})
