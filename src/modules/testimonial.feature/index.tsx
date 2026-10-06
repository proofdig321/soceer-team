import { Module } from '@/modules'
import type { TestimonialFeature } from '@/sanity/types'
import Img from '@/ui/img'

export default function ({
	quote,
	name,
	role,
	image,
	backgroundImage,
	...props
}: TestimonialFeature) {
	return (
		<Module
			className="relative overflow-hidden"
			{...props}
		>
			{backgroundImage?.asset && (
				<>
					<Img
						image={backgroundImage}
						width={1920}
						alt=""
						className="pointer-events-none absolute inset-0 size-full object-cover"
						aria-hidden
					/>
					<div className="pointer-events-none absolute inset-0 bg-foreground/70" aria-hidden />
				</>
			)}

			<div
				className={
					backgroundImage?.asset
						? 'section relative grid gap-8 py-20 text-white md:grid-cols-[auto_1fr] md:items-center md:gap-12'
						: 'section grid gap-8 py-16 md:grid-cols-[auto_1fr] md:items-center md:gap-12'
				}
			>
				{image?.asset && (
					<Img
						image={image}
						width={160}
						alt={image.alt ?? name ?? ''}
						className="size-24 shrink-0 rounded-full object-cover ring-4 ring-current/20 md:size-40"
					/>
				)}

				<figure className="grid gap-6">
					<blockquote>
						<p className="h2 max-w-3xl font-normal leading-snug before:content-['\u201C'] after:content-['\u201D']">
							{quote}
						</p>
					</blockquote>
					<figcaption className="flex flex-col gap-0.5">
						<span className="font-semibold">{name}</span>
						{role && (
							<span className={backgroundImage?.asset ? 'text-sm opacity-70' : 'text-sm text-foreground/60'}>
								{role}
							</span>
						)}
					</figcaption>
				</figure>
			</div>
		</Module>
	)
}
