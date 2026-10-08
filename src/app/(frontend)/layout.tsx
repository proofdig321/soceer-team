import { VisualEditing } from 'next-sanity/visual-editing'
import { Geist, Geist_Mono } from 'next/font/google'
import { draftMode } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { preconnect } from 'react-dom'
import { dev } from '@/lib/env'
import { SanityLive } from '@/sanity/lib/live'
import DraftModeBanner from '@/ui/draft-mode-banner'
import '@/app.css'

const fontSans = Geist({ subsets: ['latin'] })
const fontMono = Geist_Mono({ subsets: ['latin'] })

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	preconnect('https://cdn.sanity.io')
	const { isEnabled: isDraftMode } = await draftMode()
	const showDrafts = isDraftMode || dev

	return (
		<html lang="en" data-scroll-behavior="smooth">
			<NuqsAdapter>
				<body className="bg-background text-foreground antialiased">
					<a href="#main-content" className="skip-link">Skip to main content</a>

					{children}

					<SanityLive includeDrafts={showDrafts} />

					{isDraftMode && (
						<>
							<VisualEditing />
							<DraftModeBanner />
						</>
					)}
				</body>
			</NuqsAdapter>
		</html>
	)
}
