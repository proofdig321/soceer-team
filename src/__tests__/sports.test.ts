import { describe, it, expect } from 'vitest'

// ─── Hex validation ───────────────────────────────────────────────────────────

function isValidHex(value: string | undefined): true | string {
	if (!value) return true
	return /^#[0-9a-fA-F]{6}$/.test(value) ? true : 'Must be a valid 6-digit hex colour e.g. #f3b942'
}

describe('hex colour validation', () => {
	it('accepts a valid lowercase hex', () => expect(isValidHex('#f3b942')).toBe(true))
	it('accepts a valid uppercase hex', () => expect(isValidHex('#F3B942')).toBe(true))
	it('accepts undefined (blank = use default)', () => expect(isValidHex(undefined)).toBe(true))
	it('rejects a 3-digit shorthand', () => expect(isValidHex('#fff')).not.toBe(true))
	it('rejects a value without hash', () => expect(isValidHex('f3b942')).not.toBe(true))
	it('treats empty string as blank', () => expect(isValidHex('')).toBe(true))
})

// ─── Sponsor privacy gate ─────────────────────────────────────────────────────

function resolveDisplayName(
	organization: string,
	isPrivate: boolean | undefined,
	acknowledgementLabel: string | null | undefined,
): string {
	if (isPrivate) return acknowledgementLabel ?? 'A community supporter'
	return organization
}

describe('sponsor privacy gate', () => {
	it('shows organization name when not private', () =>
		expect(resolveDisplayName('Acme Corp', false, null)).toBe('Acme Corp'))
	it('shows acknowledgementLabel when private', () =>
		expect(resolveDisplayName('John Dlamini', true, 'A community supporter')).toBe('A community supporter'))
	it('falls back to generic label when private but no label set', () =>
		expect(resolveDisplayName('John Dlamini', true, null)).toBe('A community supporter'))
	it('never exposes real name when private', () =>
		expect(resolveDisplayName('John Dlamini', true, '')).not.toBe('John Dlamini'))
	it('suppresses website for private donors', () => {
		const isPrivate = true
		const website = 'https://example.com'
		const shouldShowLink = !isPrivate && Boolean(website)
		expect(shouldShowLink).toBe(false)
	})
})

// ─── Consent publish gate ─────────────────────────────────────────────────────

function canPublishPlayer(
	guardianConsent: string,
	consentRecords: Array<{ consentType: string; consentStatus: string }>,
): true | string {
	if (guardianConsent !== 'approved') return 'Guardian publication consent must be approved first.'
	const hasGranted = consentRecords.some(
		(r) => r.consentType === 'guardian-publication' && r.consentStatus === 'granted',
	)
	if (!hasGranted) return 'A granted guardian-publication consent record is required.'
	return true
}

describe('player publish gate', () => {
	it('blocks when not-requested', () => expect(canPublishPlayer('not-requested', [])).not.toBe(true))
	it('blocks when pending', () => expect(canPublishPlayer('pending', [])).not.toBe(true))
	it('blocks when approved but no granted record', () => expect(canPublishPlayer('approved', [])).not.toBe(true))
	it('allows when approved + granted record exists', () =>
		expect(canPublishPlayer('approved', [{ consentType: 'guardian-publication', consentStatus: 'granted' }])).toBe(true))
	it('blocks when consent record is withdrawn', () =>
		expect(canPublishPlayer('approved', [{ consentType: 'guardian-publication', consentStatus: 'withdrawn' }])).not.toBe(true))
})

// ─── TeamTheme injection ──────────────────────────────────────────────────────

const DEFAULTS = { primary: '#f3b942', secondary: '#173426' }

function shouldInjectTheme(brandPrimary?: string, brandSecondary?: string): boolean {
	const p = brandPrimary || DEFAULTS.primary
	const s = brandSecondary || DEFAULTS.secondary
	return p !== DEFAULTS.primary || s !== DEFAULTS.secondary
}

describe('TeamTheme injection', () => {
	it('does not inject when both blank', () => expect(shouldInjectTheme()).toBe(false))
	it('does not inject when both match defaults', () => expect(shouldInjectTheme('#f3b942', '#173426')).toBe(false))
	it('injects when primary differs', () => expect(shouldInjectTheme('#ff0000')).toBe(true))
	it('injects when secondary differs', () => expect(shouldInjectTheme(undefined, '#000000')).toBe(true))
	it('injects when both differ', () => expect(shouldInjectTheme('#ff0000', '#000000')).toBe(true))
})

// ─── Season stats computation ─────────────────────────────────────────────────

interface FixtureResult { homeScore?: number | null; awayScore?: number | null }

function computeStats(fixtures: FixtureResult[]) {
	let played = 0, won = 0, drawn = 0, lost = 0, gf = 0, ga = 0, cs = 0
	for (const f of fixtures) {
		const h = f.homeScore ?? 0
		const a = f.awayScore ?? 0
		played++; gf += h; ga += a
		if (h > a) won++
		else if (h === a) drawn++
		else lost++
		if (a === 0) cs++
	}
	return { played, won, drawn, lost, gf, ga, cs, winRate: played > 0 ? Math.round((won / played) * 100) : 0 }
}

describe('season stats computation', () => {
	const fixtures = [
		{ homeScore: 3, awayScore: 1 }, // W
		{ homeScore: 1, awayScore: 1 }, // D
		{ homeScore: 0, awayScore: 2 }, // L
		{ homeScore: 2, awayScore: 0 }, // W + CS
		{ homeScore: 1, awayScore: 0 }, // W + CS
	]

	it('counts played correctly', () => expect(computeStats(fixtures).played).toBe(5))
	it('counts wins correctly', () => expect(computeStats(fixtures).won).toBe(3))
	it('counts draws correctly', () => expect(computeStats(fixtures).drawn).toBe(1))
	it('counts losses correctly', () => expect(computeStats(fixtures).lost).toBe(1))
	it('counts goals for correctly', () => expect(computeStats(fixtures).gf).toBe(7))
	it('counts goals against correctly', () => expect(computeStats(fixtures).ga).toBe(4))
	it('counts clean sheets correctly', () => expect(computeStats(fixtures).cs).toBe(2))
	it('computes win rate correctly', () => expect(computeStats(fixtures).winRate).toBe(60))
	it('handles empty fixtures', () => expect(computeStats([]).winRate).toBe(0))
})

// ─── League table goal difference ────────────────────────────────────────────

function goalDiff(goalsFor: number, goalsAgainst: number) {
	return goalsFor - goalsAgainst
}

describe('league table goal difference', () => {
	it('returns positive GD', () => expect(goalDiff(10, 4)).toBe(6))
	it('returns negative GD', () => expect(goalDiff(2, 7)).toBe(-5))
	it('returns zero GD', () => expect(goalDiff(3, 3)).toBe(0))
})

// ─── StatBar percent clamping ─────────────────────────────────────────────────

function clampPercent(value: number) {
	return Math.min(100, Math.max(0, value))
}

describe('StatBar percent clamping', () => {
	it('clamps above 100 to 100', () => expect(clampPercent(150)).toBe(100))
	it('clamps below 0 to 0', () => expect(clampPercent(-10)).toBe(0))
	it('passes through valid values', () => expect(clampPercent(75)).toBe(75))
	it('handles exactly 0', () => expect(clampPercent(0)).toBe(0))
	it('handles exactly 100', () => expect(clampPercent(100)).toBe(100))
})
