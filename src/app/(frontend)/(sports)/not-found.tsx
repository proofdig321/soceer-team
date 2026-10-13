import type { Metadata } from 'next'
import NotFoundView from '@/ui/not-found'

export const metadata: Metadata = {
	title: '404 — Page not found',
	robots: { index: false },
}

export default function NotFound() {
	return <NotFoundView variant="sports" homeHref="/" />
}
