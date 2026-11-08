import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createContentBatch } from '@/lib/db/store'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, topics } = body

    if (!name || !Array.isArray(topics) || topics.length !== 5) {
      return NextResponse.json(
        { error: 'A content research batch must contain exactly 5 topics.' },
        { status: 400 }
      )
    }

    // Verify Rule 5.1: Source links must be valid URLs
    for (let i = 0; i < topics.length; i++) {
      const t = topics[i]
      if (!t.title || !t.sourceUrl) {
        return NextResponse.json(
          { error: `Topic #${i + 1} is missing a title or source URL.` },
          { status: 400 }
        )
      }
      try {
        new URL(t.sourceUrl)
      } catch {
        return NextResponse.json(
          { error: `Topic #${i + 1} has an invalid source URL (${t.sourceUrl}). Must be a valid URL.` },
          { status: 400 }
        )
      }
    }

    const batch = createContentBatch(name, topics)
    return NextResponse.json({ success: true, batch })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
