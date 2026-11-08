import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { convertBatchToApprovals } from '@/lib/db/store'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { batchId } = body

    if (!batchId) {
      return NextResponse.json({ error: 'batchId is required' }, { status: 400 })
    }

    const createdApprovals = convertBatchToApprovals(batchId)
    return NextResponse.json({
      success: true,
      count: createdApprovals.length,
      approvals: createdApprovals,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
