import { PortableText, stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'
import { Module } from '@/modules'
import type { HeroVideo } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Eyebrow from '@/ui/eyebrow'
import Img from '@/ui/img'

export default function ({
	eyebrow,
	content = [],
	ctas,
	videoUrl,
	poster,
	overlayOpacity = 0.5,
	textAlign: ta = 'center',
	...props
}: HeroVideo) {
	const textAlign = stegaClean(ta)
	const url = stegaClean(videoUrl)
	const opacity = Number(stegaClean(overlayOpacity))

	return (
		<Module
			className={cn(
				'relative grid min-h-[70svh] items-center',
				textAlign === 'left' && 'justify-start text-left',
				textAlign === 'center' && 'justify-center text-center',
				textAlign === 'right' && 'justify-end text-right',
			)}
			{...props}
		>
			{/* Background */}
			{url ? (
				<video
					className="pointer-events-none absolute inset-0 size-full object-cover motion-reduce:hidden"
					autoPlay
					muted
					loop
					playsInline
					poster={poster?.asset ? undefined : undefined}
					aria-hidden
				>
					<source src={url} type="video/mp4" />
				</video>
			) : null}

			{/* Poster fallback (always rendered, hidden behind video when video plays) */}
			{poster?.asset && (
				<Img
					image={poster}
					width={1920}
					alt={poster.alt ?? ''}
					className={cn(
						'pointer-events-none absolute inset-0 size-full object-cover',
						url && 'motion-safe:hidden',
					)}
					draggable={false}
				/>
			)}

			{/* Overlay */}
			<div
				className="pointer-events-none absolute inset-0 bg-black"
				style={{ opacity }}
				aria-hidden
			/>

			{/* Content */}
			<div
				className={cn(
					'section relative text-white',
					textAlign === 'left' && 'justify-start',
					textAlign === 'center' && 'justify-center',
					textAlign === 'right' && 'justify-end',
				)}
			>
				<header className="prose max-w-2xl">
					<Eyebrow value={eyebrow} />
					<PortableText value={content} />
					<CTAList
						ctas={ctas}
						className={cn('max-sm:*:w-full', {
							'justify-start': textAlign === 'left',
							'justify-center': textAlign === 'center',
							'justify-end': textAlign === 'right',
						})}
					/>
				</header>
			</div>
		</Module>
	)
}
