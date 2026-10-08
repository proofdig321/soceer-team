import { stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'

export default function ({
	value,
	className,
	...props
}: { value?: string } & React.ComponentProps<'p'>) {
	if (!value) return null

	return (
		<p
			className={cn(
				'technical inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase',
				'before:block before:h-px before:w-6 before:bg-current before:opacity-60',
				'text-current/70',
				className,
			)}
			{...props}
		>
			{stegaClean(value)}
		</p>
	)
}
