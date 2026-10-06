import { PortableText, stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'
import { Module } from '@/modules'
import type { MediaSplit } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Eyebrow from '@/ui/eyebrow'
import Img from '@/ui/img'

function resolveEmbedUrl(raw: string): string | null {
	try {
		const url = new URL(raw)
		const ytId =
			url.searchParams.get('v') ||
			(url.hostname === 'youtu.be' ? url.pathname.slice(1) : null)
		if (ytId) return `https://www.youtube-nocookie.com/embed/${ytId}`
		const vimeoMatch = url.pathname.match(/\/(\d+)/)
		if (url.hostname.includes('vimeo') && vimeoMatch)
			return `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`
	} catch {}
	return null
}

export default function ({
	eyebrow,
	content = [],
	ctas,
	image,
	videoUrl,
	mediaOnRight = false,
	mediaAspectRatio: ar = '4/3',
	...props
}: MediaSplit) {
	const embedUrl = videoUrl ? resolveEmbedUrl(stegaClean(videoUrl)) : null
	const ratio = stegaClean(ar)

	return (
		<Module
			className="section grid items-center gap-8 md:grid-cols-2 md:gap-12"
			{...props}
		>
			{/* Media */}
			<div
				className={cn(
					'relative overflow-hidden bg-foreground/5',
					mediaOnRight && 'md:order-last',
				)}
				style={{ aspectRatio: ratio }}
			>
				{embedUrl ? (
					<iframe
						src={embedUrl}
						title="Video"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						loading="lazy"
						className="absolute inset-0 size-full border-0"
					/>
				) : image?.asset ? (
					<Img
						image={image}
						width={800}
						alt={image.alt ?? ''}
						className="absolute inset-0 size-full object-cover"
					/>
				) : null}
			</div>

			{/* Content */}
			<header className="prose">
				<Eyebrow value={eyebrow} />
				<PortableText value={content} />
				<CTAList ctas={ctas} className="max-sm:*:w-full" />
			</header>
		</Module>
	)
}
