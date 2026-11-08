import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getActiveBatch, updateTopicFormat } from '@/lib/db/store'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const batch = getActiveBatch()
  return NextResponse.json({ batch })
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { batchId, topicId, format } = body

    if (!batchId || !topicId || !format) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const success = updateTopicFormat(batchId, topicId, format)
    return NextResponse.json({ success })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
