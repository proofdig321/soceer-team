'use client'

import { cn } from '@/lib/utils'
import { usePagination } from '@/hooks/usePagination'

export type { PaginationProps }

type PaginationProps = {
	className?: string
	onClick?: () => void
}

/**
 * Branded pagination bar — wire up via usePagination hook.
 * Renders nothing when there's only one page.
 */
export function Pagination({
	currentPage,
	totalPages,
	onPrev,
	onNext,
	atStart,
	atEnd,
	className,
	onClick,
}: {
	currentPage: number
	totalPages: number
	onPrev: () => void
	onNext: () => void
	atStart: boolean
	atEnd: boolean
} & PaginationProps) {
	if (atStart && atEnd) return null

	return (
		<nav
			aria-label="Pagination"
			className={cn('flex items-center justify-center gap-4', className)}
		>
			<button
				onClick={() => { onPrev(); onClick?.() }}
				disabled={atStart}
				aria-label="Previous page"
				className="group flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all hover:border-gold/50 hover:bg-gold/10 disabled:pointer-events-none disabled:opacity-30"
			>
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:-translate-x-0.5">
					<path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>

			<div className="flex items-center gap-1.5" aria-hidden>
				{Array.from({ length: totalPages }, (_, i) => (
					<span
						key={i}
						className={cn(
							'block rounded-full transition-all duration-300',
							i + 1 === currentPage
								? 'w-5 h-1.5 bg-gold'
								: 'size-1.5 bg-white/20',
						)}
					/>
				))}
			</div>

			<span className="technical text-[10px] text-white/40 tabular-nums">
				{currentPage} / {totalPages}
			</span>

			<button
				onClick={() => { onNext(); onClick?.() }}
				disabled={atEnd}
				aria-label="Next page"
				className="group flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all hover:border-gold/50 hover:bg-gold/10 disabled:pointer-events-none disabled:opacity-30"
			>
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-0.5">
					<path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>
		</nav>
	)
}

/**
 * Drop-in paginated list wrapper.
 * Usage: <PaginatedList items={arr} itemsPerPage={9} renderItem={(item) => <Card {...item} />} />
 */
export function PaginatedList<T>({
	items,
	itemsPerPage = 9,
	renderItem,
	gridClassName,
	className,
}: {
	items: T[]
	itemsPerPage?: number
	renderItem: (item: T, index: number) => React.ReactNode
	gridClassName?: string
	className?: string
}) {
	const { paginatedItems, currentPage, totalPages, onPrev, onNext, atStart, atEnd } =
		usePagination({ items, itemsPerPage })

	return (
		<div className={cn('space-y-8', className)}>
			<div className={gridClassName}>
				{paginatedItems.map((item, i) => renderItem(item, i))}
			</div>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPrev={onPrev}
				onNext={onNext}
				atStart={atStart}
				atEnd={atEnd}
			/>
		</div>
	)
}
