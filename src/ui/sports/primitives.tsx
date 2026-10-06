/**
 * Sports UI primitives — reusable building blocks for all Sports surfaces.
 * Sits on top of the SanityPress design system (Tailwind utilities, cn, etc.)
 * and provides Sports-specific semantic wrappers.
 */

import Link from 'next/link'
import { cn } from '@/lib/utils'

// ─── Navigation ──────────────────────────────────────────────────────────────

const navLinks = [
	{ href: '/sports', label: 'Overview' },
	{ href: '/teams', label: 'Teams' },
	{ href: '/fixtures', label: 'Fixtures' },
	{ href: '/events', label: 'Events' },
	{ href: '/competitions', label: 'Competitions' },
]

export function SportsNav({ current }: { current?: string }) {
	return (
		<nav aria-label="Sports directory">
			<ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
				{navLinks.map(({ href, label }) => (
					<li key={href}>
						<Link
							className={cn(
								'hover:decoration-2 underline',
								current === href
									? 'font-semibold text-foreground decoration-2'
									: 'text-foreground/60 hover:text-foreground',
							)}
							href={href}
							aria-current={current === href ? 'page' : undefined}
						>
							{label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}

// ─── Shell / page wrapper ─────────────────────────────────────────────────────

export function SportsShell({
	eyebrow = 'Unami Sports',
	title,
	intro,
	current,
	children,
	className,
}: {
	eyebrow?: string
	title: string
	intro?: string
	current?: string
	children: React.ReactNode
	className?: string
}) {
	return (
		<div className={cn('section grid gap-10 py-12', className)}>
			<header className="grid gap-4">
				<p className="technical text-sm text-foreground/50">{eyebrow}</p>
				<h1 className="h0 max-w-3xl">{title}</h1>
				{intro && <p className="max-w-prose text-lg leading-relaxed">{intro}</p>}
				<SportsNav current={current} />
			</header>
			{children}
		</div>
	)
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function SportsSection({
	title,
	children,
	className,
}: {
	title?: string
	children: React.ReactNode
	className?: string
}) {
	return (
		<section className={cn('grid gap-5', className)}>
			{title && <h2 className="h2">{title}</h2>}
			{children}
		</section>
	)
}

// ─── Empty state ──────────────────────────────────────────────────────────────

export function SportsEmpty({ label }: { label: string }) {
	return (
		<p className="border-stroke border p-5 text-foreground/60">
			No {label} are listed right now.
		</p>
	)
}

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = 'default' | 'success' | 'warning' | 'muted'

const badgeVariants: Record<BadgeVariant, string> = {
	default: 'bg-foreground/8 text-foreground',
	success: 'bg-emerald-100 text-emerald-800',
	warning: 'bg-amber-100 text-amber-800',
	muted: 'bg-foreground/5 text-foreground/50',
}

export function SportsBadge({
	label,
	variant = 'default',
}: {
	label: string
	variant?: BadgeVariant
}) {
	return (
		<span
			className={cn(
				'technical inline-block rounded-sm px-2 py-0.5 text-xs',
				badgeVariants[variant],
			)}
		>
			{label}
		</span>
	)
}

// ─── Meta row ─────────────────────────────────────────────────────────────────

export function SportsMeta({
	items,
	className,
}: {
	items: (string | null | undefined)[]
	className?: string
}) {
	const filtered = items.filter(Boolean) as string[]
	if (!filtered.length) return null
	return (
		<p className={cn('text-sm text-foreground/60', className)}>
			{filtered.join(' · ')}
		</p>
	)
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function SportsCard({
	children,
	className,
	as: Tag = 'div',
}: {
	children: React.ReactNode
	className?: string
	as?: React.ElementType
}) {
	return (
		<Tag
			className={cn(
				'border-stroke grid content-start gap-3 border p-5',
				className,
			)}
		>
			{children}
		</Tag>
	)
}

// ─── Card grid ────────────────────────────────────────────────────────────────

export function SportsCardGrid({
	children,
	cols = 3,
	className,
}: {
	children: React.ReactNode
	cols?: 2 | 3 | 4
	className?: string
}) {
	return (
		<ul
			className={cn(
				'grid gap-4',
				cols === 2 && 'sm:grid-cols-2',
				cols === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
				cols === 4 && 'sm:grid-cols-2 lg:grid-cols-4',
				className,
			)}
		>
			{children}
		</ul>
	)
}

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatSportsDate(
	value: string,
	style: 'date' | 'datetime' = 'date',
) {
	return new Intl.DateTimeFormat('en-ZA', {
		dateStyle: 'medium',
		...(style === 'datetime' && { timeStyle: 'short' }),
		timeZone: 'Africa/Johannesburg',
	}).format(new Date(value))
}

// ─── Sport label ──────────────────────────────────────────────────────────────

const sportLabels: Record<string, string> = {
	football: 'Football',
	rugby: 'Rugby',
	basketball: 'Basketball',
	tennis: 'Tennis',
	netball: 'Netball',
	cricket: 'Cricket',
	athletics: 'Athletics',
	other: 'Sport',
}

export function sportLabel(value: string | null | undefined) {
	if (!value) return undefined
	return sportLabels[value] ?? value
}

// ─── Format label ─────────────────────────────────────────────────────────────

const formatLabels: Record<string, string> = {
	tournament: 'Tournament',
	league: 'Development league',
	festival: 'Festival',
}

export function competitionFormatLabel(value: string | null | undefined) {
	if (!value) return undefined
	return formatLabels[value] ?? value
}

// ─── Fixture status ───────────────────────────────────────────────────────────

export function fixtureStatusBadge(status: string | null | undefined) {
	if (status === 'completed') return { label: 'Result', variant: 'success' as BadgeVariant }
	if (status === 'scheduled') return { label: 'Upcoming', variant: 'default' as BadgeVariant }
	if (status === 'postponed') return { label: 'Postponed', variant: 'warning' as BadgeVariant }
	return null
}
