import { Module } from '@/modules'
import type { FeatureBar } from '@/sanity/types'
import Img from '@/ui/img'

export default function ({ items, ...props }: FeatureBar) {
	if (!items?.length) return null

	return (
		<Module className="border-y border-white/10 bg-forest/95" {...props}>
			<ul className="section-sm py-0 section flex flex-wrap items-start justify-center gap-x-10 gap-y-6 py-8 md:gap-x-16">
				{items.map((item, i) => (
					<li
						key={`${item._key ?? i}`}
						className="flex items-start gap-3 max-w-[200px]"
					>
						{item.icon?.asset ? (
							<Img
								image={item.icon}
								width={32}
								alt={item.icon.alt ?? ''}
								className="mt-0.5 size-6 shrink-0 object-contain opacity-80"
							/>
						) : (
							<span className="mt-2 block size-1.5 shrink-0 rounded-full bg-gold" />
						)}
						<div>
							<p className="text-sm font-semibold text-white">{item.label}</p>
							{item.description && (
								<p className="mt-0.5 text-xs leading-relaxed text-white/55">
									{item.description}
								</p>
							)}
						</div>
					</li>
				))}
			</ul>
		</Module>
	)
}
