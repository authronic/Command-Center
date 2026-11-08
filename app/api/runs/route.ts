import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getRuns } from '@/lib/db/store'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const runs = getRuns()
  return NextResponse.json({ runs })
}
