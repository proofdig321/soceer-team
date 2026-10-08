import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { token } from '@/sanity/lib/token'

export async function POST(req: NextRequest) {
	const auth = req.headers.get('authorization')
	if (auth !== `Bearer ${token}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
	revalidateTag('sanity:page', 'default')
	return NextResponse.json({ revalidated: true })
}
