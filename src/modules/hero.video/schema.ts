import { defineField } from 'sanity'
import { PlayIcon } from '@sanity/icons/Play'
import { getBlockText } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'hero.video',
	title: 'Hero (video)',
	type: 'object',
	icon: PlayIcon,
	groups: [
		{ name: 'content', default: true },
		{ name: 'video' },
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
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'videoUrl',
			title: 'Background video URL (mp4)',
			type: 'url',
			group: 'video',
			description: 'Direct .mp4 URL. Autoplay, muted, loop. Keep under 5MB for performance.',
		}),
		defineField({
			name: 'poster',
			title: 'Poster / fallback image',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [defineField({ name: 'alt', type: 'string' })],
			group: 'video',
			validation: (Rule) => Rule.required().error('A poster image is required as fallback.'),
		}),
		defineField({
			name: 'overlayOpacity',
			title: 'Dark overlay opacity',
			type: 'number',
			initialValue: 0.5,
			validation: (Rule) => Rule.min(0).max(1),
			group: 'options',
			description: '0 = no overlay, 1 = fully black. 0.4–0.6 recommended for legibility.',
		}),
		defineField({
			name: 'textAlign',
			type: 'string',
			options: { list: ['left', 'center', 'right'], layout: 'radio' },
			initialValue: 'center',
			group: 'options',
		}),
	],
	preview: {
		select: { content: 'content', poster: 'poster' },
		prepare: ({ content, poster }) => ({
			title: getBlockText(content),
			subtitle: 'Hero (video)',
			media: poster,
		}),
	},
})
