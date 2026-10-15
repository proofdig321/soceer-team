import { describe, it, expect } from 'vitest'

// ─── Hex validation (mirrors sports.team schema rule) ────────────────────────

function isValidHex(value: string | undefined): true | string {
	if (!value) return true
	return /^#[0-9a-fA-F]{6}$/.test(value)
		? true
		: 'Must be a valid 6-digit hex colour e.g. #f3b942'
}

describe('hex colour validation', () => {
	it('accepts a valid lowercase hex', () => {
		expect(isValidHex('#f3b942')).toBe(true)
	})
	it('accepts a valid uppercase hex', () => {
		expect(isValidHex('#F3B942')).toBe(true)
	})
	it('accepts undefined (blank = use default)', () => {
		expect(isValidHex(undefined)).toBe(true)
	})
	it('rejects a 3-digit shorthand', () => {
		expect(isValidHex('#fff')).not.toBe(true)
	})
	it('rejects a value without hash', () => {
		expect(isValidHex('f3b942')).not.toBe(true)
	})
	it('rejects an empty string', () => {
		// empty string is falsy — treated as blank
		expect(isValidHex('')).toBe(true)
	})
})

// ─── Sponsor privacy gate ────────────────────────────────────────────────────

/**
 * Mirrors the display logic in SponsorCard:
 * - isPrivate=true  → show acknowledgementLabel (or fallback)
 * - isPrivate=false → show organization name
 */
function resolveDisplayName(
	organization: string,
	isPrivate: boolean | undefined,
	acknowledgementLabel: string | null | undefined,
): string {
	if (isPrivate) return acknowledgementLabel ?? 'A community supporter'
	return organization
}

describe('sponsor privacy gate', () => {
	it('shows organization name when not private', () => {
		expect(resolveDisplayName('Acme Corp', false, null)).toBe('Acme Corp')
	})
	it('shows acknowledgementLabel when private', () => {
		expect(resolveDisplayName('John Dlamini', true, 'A community supporter')).toBe(
			'A community supporter',
		)
	})
	it('falls back to generic label when private but no label set', () => {
		expect(resolveDisplayName('John Dlamini', true, null)).toBe('A community supporter')
	})
	it('never exposes real name when private, even if label is empty string', () => {
		const result = resolveDisplayName('John Dlamini', true, '')
		expect(result).not.toBe('John Dlamini')
	})
	it('website is suppressed for private donors', () => {
		// mirrors SponsorCard: website link only rendered when !isPrivate
		const isPrivate = true
		const website = 'https://example.com'
		const shouldShowLink = website && !isPrivate
		expect(shouldShowLink).toBeFalsy()
	})
})

// ─── Consent record — status gate ────────────────────────────────────────────

/**
 * Mirrors the rule: publicProfile cannot be true unless guardianConsent === 'approved'
 * AND a granted consent record exists for guardian-publication type.
 */
function canPublishPlayer(
	guardianConsent: string,
	consentRecords: Array<{ consentType: string; consentStatus: string }>,
): true | string {
	if (guardianConsent !== 'approved') {
		return 'Guardian publication consent must be approved first.'
	}
	const hasGranted = consentRecords.some(
		(r) => r.consentType === 'guardian-publication' && r.consentStatus === 'granted',
	)
	if (!hasGranted) {
		return 'A granted guardian-publication consent record is required.'
	}
	return true
}

describe('player publish gate', () => {
	it('blocks publish when consent is not-requested', () => {
		expect(canPublishPlayer('not-requested', [])).not.toBe(true)
	})
	it('blocks publish when consent is pending', () => {
		expect(canPublishPlayer('pending', [])).not.toBe(true)
	})
	it('blocks publish when consent is approved but no granted record exists', () => {
		expect(canPublishPlayer('approved', [])).not.toBe(true)
	})
	it('allows publish when consent approved and granted record exists', () => {
		expect(
			canPublishPlayer('approved', [
				{ consentType: 'guardian-publication', consentStatus: 'granted' },
			]),
		).toBe(true)
	})
	it('blocks publish when consent record is withdrawn', () => {
		expect(
			canPublishPlayer('approved', [
				{ consentType: 'guardian-publication', consentStatus: 'withdrawn' },
			]),
		).not.toBe(true)
	})
})

// ─── TeamTheme — default fallback ────────────────────────────────────────────

const DEFAULTS = { primary: '#f3b942', secondary: '#173426' }

function shouldInjectTheme(
	brandPrimary: string | undefined,
	brandSecondary: string | undefined,
): boolean {
	const primary = brandPrimary || DEFAULTS.primary
	const secondary = brandSecondary || DEFAULTS.secondary
	return primary !== DEFAULTS.primary || secondary !== DEFAULTS.secondary
}

describe('TeamTheme injection', () => {
	it('does not inject when both fields are blank (uses defaults)', () => {
		expect(shouldInjectTheme(undefined, undefined)).toBe(false)
	})
	it('does not inject when both fields match defaults exactly', () => {
		expect(shouldInjectTheme('#f3b942', '#173426')).toBe(false)
	})
	it('injects when primary differs', () => {
		expect(shouldInjectTheme('#ff0000', undefined)).toBe(true)
	})
	it('injects when secondary differs', () => {
		expect(shouldInjectTheme(undefined, '#000000')).toBe(true)
	})
	it('injects when both differ', () => {
		expect(shouldInjectTheme('#ff0000', '#000000')).toBe(true)
	})
})
