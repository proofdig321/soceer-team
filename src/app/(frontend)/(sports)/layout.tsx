import { Suspense } from 'react'
import { draftMode } from 'next/headers'
import { dev, ROUTES } from '@/lib/env'
import Announcement, { DynamicAnnouncement } from '@/ui/announcement'
import Footer, { DynamicFooter } from '@/ui/footer'
import Header, { DynamicHeader } from '@/ui/header'

export default async function SportsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { isEnabled: isDraftMode } = await draftMode()
	const showDrafts = isDraftMode || dev

	return (
		<>
			<a href="#main-content" className="skip-link">Skip to main content</a>
			<a href={`/${ROUTES.a11y}`} className="skip-link">Accessibility statement</a>

			{showDrafts ? (
				<Suspense><DynamicAnnouncement /></Suspense>
			) : (
				<Announcement perspective="published" stega={false} />
			)}

			{showDrafts ? (
				<Suspense fallback={<div className="header-fallback" />}>
					<DynamicHeader />
				</Suspense>
			) : (
				<Header perspective="published" stega={false} />
			)}

			<main id="main-content" tabIndex={-1}>
				{children}
			</main>

			{showDrafts ? (
				<Suspense fallback={<div className="footer-fallback" />}>
					<DynamicFooter />
				</Suspense>
			) : (
				<Footer perspective="published" stega={false} />
			)}
		</>
	)
}
