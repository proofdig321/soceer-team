import { PortableText, stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'
import { Module } from '@/modules'
import type { StatList } from '@/sanity/types'
import Eyebrow from '@/ui/eyebrow'

export default function ({
	eyebrow,
	intro,
	stats,
	layout: l = 'grid',
	columns,
	...props
}: StatList) {
	const layout = stegaClean(l)

	return (
		<Module className="surface-dark section-sm" {...props}>
			<div className="section py-0">
				{(eyebrow || intro) && (
					<header className="prose mb-12 text-center text-white">
						<Eyebrow value={eyebrow} className="text-gold" />
						<PortableText value={intro} />
					</header>
				)}

				<dl
					className={cn(
						'grid gap-px overflow-hidden rounded-lg border border-white/10',
						layout === 'carousel'
							? 'carousel carousel-scroll-buttons carousel-scroll-marker max-md:full-bleed auto-rows-fr pb-2 max-md:px-4'
							: [
									'md:auto-rows-fr',
									columns
										? 'lg:grid-cols-[repeat(var(--columns,1),minmax(0px,1fr))]'
										: 'sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]',
								],
					)}
					style={{ '--columns': columns }}
				>
					{stats?.map(({ value, suffix, content = [], _key }, i) => (
						<div
							key={`${_key}-${i}`}
							className="flex flex-col gap-2 bg-white/5 px-8 py-10 hover:bg-white/8 transition-colors"
						>
							<dt className="flex items-baseline gap-2">
								<span
									className="font-bold leading-none tracking-tight text-gold"
									style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
								>
									{value}
								</span>
								{suffix && (
									<span className="text-2xl font-bold text-gold/70">{suffix}</span>
								)}
							</dt>
							{content && (
								<dd className="prose text-sm text-white/70">
									<PortableText value={content} />
								</dd>
							)}
						</div>
					))}
				</dl>
			</div>
		</Module>
	)
}
