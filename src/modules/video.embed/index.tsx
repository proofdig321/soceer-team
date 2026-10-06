import { stegaClean } from 'next-sanity'
import { Module } from '@/modules'
import type { VideoEmbed } from '@/sanity/types'
import Eyebrow from '@/ui/eyebrow'
import Img from '@/ui/img'

function resolveEmbedUrl(raw: string): string | null {
	try {
		const url = new URL(raw)
		// YouTube
		const ytId =
			url.searchParams.get('v') ||
			(url.hostname === 'youtu.be' ? url.pathname.slice(1) : null)
		if (ytId) return `https://www.youtube-nocookie.com/embed/${ytId}`
		// Vimeo
		const vimeoMatch = url.pathname.match(/\/(\d+)/)
		if (url.hostname.includes('vimeo') && vimeoMatch)
			return `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`
	} catch {}
	return null
}

export default function ({
	eyebrow,
	title,
	caption,
	url,
	poster,
	aspectRatio: ar = '16/9',
	...props
}: VideoEmbed) {
	const embedUrl = url ? resolveEmbedUrl(stegaClean(url)) : null
	const ratio = stegaClean(ar)

	return (
		<Module className="section space-y-4" {...props}>
			{(eyebrow || title) && (
				<header className="prose mx-auto max-w-3xl text-center">
					<Eyebrow value={eyebrow} />
					{title && <h2 className="h2">{title}</h2>}
				</header>
			)}

			<div
				className="relative mx-auto w-full overflow-hidden bg-foreground/5"
				style={{ aspectRatio: ratio }}
			>
				{embedUrl ? (
					<iframe
						src={embedUrl}
						title={title ?? 'Video'}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						loading="lazy"
						className="absolute inset-0 size-full border-0"
					/>
				) : poster?.asset ? (
					<Img
						image={poster}
						width={1280}
						alt={poster.alt ?? title ?? ''}
						className="absolute inset-0 size-full object-cover"
					/>
				) : null}
			</div>

			{caption && (
				<p className="mx-auto max-w-3xl text-center text-sm text-foreground/60">
					{caption}
				</p>
			)}
		</Module>
	)
}
