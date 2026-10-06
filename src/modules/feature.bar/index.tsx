import { Module } from '@/modules'
import type { FeatureBar } from '@/sanity/types'
import Img from '@/ui/img'

export default function ({ items, ...props }: FeatureBar) {
	if (!items?.length) return null

	return (
		<Module
			className="border-stroke border-y bg-foreground/[0.02]"
			{...props}
		>
			<ul className="section flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-6 md:gap-x-12">
				{items.map((item, i) => (
					<li
						key={`${item._key ?? i}`}
						className="flex items-center gap-3"
					>
						{item.icon?.asset && (
							<Img
								image={item.icon}
								width={32}
								alt={item.icon.alt ?? ''}
								className="size-8 shrink-0 object-contain"
							/>
						)}
						<div>
							<p className="technical text-sm font-semibold">{item.label}</p>
							{item.description && (
								<p className="text-xs text-foreground/60">{item.description}</p>
							)}
						</div>
					</li>
				))}
			</ul>
		</Module>
	)
}
