import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { decideApproval } from '@/lib/db/store'

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
    const body = await request.json()
    const { action, feedback } = body

    if (!['approved', 'revision_requested', 'rejected'].includes(action)) {
      return NextResponse.json({ error: 'Invalid decision action' }, { status: 400 })
    }

    const reviewer = session.user?.name || 'Authronic Founder'
    const result = decideApproval(id, action, feedback, reviewer)

    if (!result) {
      return NextResponse.json({ error: 'Approval item not found' }, { status: 404 })
    }

    return NextResponse.json({ approval: result })
  } catch (error) {
    console.error('Error submitting approval decision:', error)
    return NextResponse.json({ error: 'Failed to record decision' }, { status: 500 })
  }
}
