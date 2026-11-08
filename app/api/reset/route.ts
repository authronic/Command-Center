import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { resetDatabase } from '@/lib/db/store'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cleanData = resetDatabase()
  return NextResponse.json({
    success: true,
    message: 'Dashboard database wiped clean. Ready for live data.',
    data: cleanData,
  })
}
