import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { retryRun } from '@/lib/db/store'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  try {
    const updated = retryRun(id)
    if (!updated) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 })
    }
    return NextResponse.json({ run: updated })
  } catch (error) {
    console.error('Error retrying run:', error)
    return NextResponse.json({ error: 'Failed to execute retry' }, { status: 500 })
  }
}
