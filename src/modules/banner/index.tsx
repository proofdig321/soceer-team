import { stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'
import { Module } from '@/modules'
import type { Banner } from '@/sanity/types'
import CTAList from '@/ui/cta-list'

const themes = {
	default: 'bg-foreground text-background',
	action: 'bg-primary text-background',
	highlight: 'bg-amber-400 text-amber-950',
	subtle: 'bg-foreground/5 text-foreground border-y border-stroke',
}

export default function ({ text, ctas, theme: t = 'default', ...props }: Banner) {
	const theme = stegaClean(t) as keyof typeof themes

	return (
		<Module
			className={cn('py-4', themes[theme] ?? themes.default)}
			{...props}
		>
			<div className="section flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-0 text-center">
				{text && <p className="font-semibold">{text}</p>}
				<CTAList ctas={ctas} />
			</div>
		</Module>
	)
}
