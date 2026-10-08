import { PortableText, stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'
import { Module } from '@/modules'
import CustomHTML from '@/modules/custom-html'
import type { HeroCover } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Eyebrow from '@/ui/eyebrow'
import Img, { Source } from '@/ui/img'

export default function ({
	eyebrow,
	content = [],
	ctas,
	image,
	textAlign: ta = 'center',
	verticalAlign: va = 'center',
	...props
}: HeroCover) {
	const textAlign = stegaClean(ta)
	const verticalAlign = stegaClean(va)
	const opacity = Number(stegaClean(image?.opacity)) ?? 1
	const hasImage = !!image?.asset

	return (
		<Module
			className={cn(
				'relative grid min-h-[90svh]',
				{
					'items-start': verticalAlign === 'top',
					'items-center': verticalAlign === 'center',
					'items-end': verticalAlign === 'bottom',
				},
				{
					'justify-start text-left': textAlign === 'left',
					'justify-center text-center': textAlign === 'center',
					'justify-end text-right': textAlign === 'right',
				},
				!hasImage && 'bg-forest text-white',
			)}
			{...props}
		>
			{hasImage && (
				<picture className="contents">
					<Source image={image.mobile} width={1000} />
					<Img
						image={image}
						width={1920}
						className="pointer-events-none absolute inset-0 size-full object-cover"
						style={{ opacity }}
						alt={image?.alt ?? ''}
						draggable={false}
					/>
				</picture>
			)}

			{/* gradient overlay for readability */}
			{hasImage && (
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/40 to-transparent" />
			)}

			<div
				className={cn(
					'section relative z-1',
					hasImage || 'text-white',
					hasImage && opacity > 0.3 && 'text-white',
				)}
			>
				<header
					className={cn(
						'prose max-w-2xl',
						textAlign === 'center' && 'mx-auto',
						textAlign === 'right' && 'ml-auto',
					)}
				>
					{eyebrow && (
						<Eyebrow
							value={eyebrow}
							className="text-gold mb-4"
						/>
					)}
					<PortableText
						value={content}
						components={{
							block: {
								h1: ({ children }) => (
									<h1 className="h0 mb-4 text-balance">{children}</h1>
								),
								normal: ({ children }) => (
									<p className="text-lg leading-relaxed opacity-85">{children}</p>
								),
							},
							types: {
								image: ({ value }) => (
									<figure>
										<Img
											className={cn('w-full', {
												'mr-auto': textAlign === 'left',
												'mx-auto': textAlign === 'center',
												'ml-auto': textAlign === 'right',
											})}
											image={value}
											width={1000}
											alt={value.alt ?? ''}
										/>
									</figure>
								),
								'custom-html': ({ value }) => <CustomHTML {...value} />,
							},
						}}
					/>
					<CTAList
						ctas={ctas}
						className={cn('mt-8 max-sm:*:w-full', {
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
