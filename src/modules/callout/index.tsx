import { PortableText } from 'next-sanity'
import { cn } from '@/lib/utils'
import { Module } from '@/modules'
import CustomHTML from '@/modules/custom-html'
import type { Callout } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Eyebrow from '@/ui/eyebrow'
import Img from '@/ui/img'

export default function ({
	eyebrow,
	intro = [],
	ctas,
	className,
	...props
}: Callout & React.ComponentProps<'section'>) {
	return (
		<Module
			className={cn('surface-dark overflow-hidden', className)}
			{...props}
		>
			<div className="section text-center">
				<div className="mx-auto max-w-2xl">
					{eyebrow && (
						<Eyebrow value={eyebrow} className="mb-4 justify-center text-gold" />
					)}
					<div className="prose text-white/90 text-balance">
						<PortableText
							value={intro}
							components={{
								block: {
									normal: ({ children }) => (
										<p className="text-xl leading-relaxed">{children}</p>
									),
								},
								types: {
									image: ({ value }) => (
										<figure>
											<Img
												className="mx-auto w-full"
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
					</div>
					<CTAList
						ctas={ctas}
						className="mt-8 justify-center max-sm:*:w-full"
					/>
				</div>
			</div>
		</Module>
	)
}
