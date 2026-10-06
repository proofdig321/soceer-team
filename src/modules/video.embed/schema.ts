import { defineField } from 'sanity'
import { PlayIcon } from '@sanity/icons/Play'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'video.embed',
	title: 'Video embed',
	type: 'object',
	icon: PlayIcon,
	groups: [
		{ name: 'content', default: true },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'eyebrow',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'title',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'caption',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'url',
			title: 'YouTube or Vimeo URL',
			type: 'url',
			group: 'content',
			description: 'Paste a YouTube or Vimeo watch URL. Privacy-enhanced embed will be used.',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'poster',
			title: 'Poster image (fallback)',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [defineField({ name: 'alt', type: 'string' })],
			group: 'content',
		}),
		defineField({
			name: 'aspectRatio',
			title: 'Aspect ratio',
			type: 'string',
			options: { list: ['16/9', '4/3', '1/1'], layout: 'radio' },
			initialValue: '16/9',
			group: 'options',
		}),
	],
	preview: {
		select: { title: 'title', url: 'url', poster: 'poster' },
		prepare: ({ title, url, poster }) => ({
			title: title || url || 'Video embed',
			subtitle: 'Video embed',
			media: poster,
		}),
	},
})
