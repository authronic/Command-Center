import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getTasks, getApprovals } from '@/lib/db/store'
import { syncToGoogleSheet } from '@/lib/google/sheets'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tasks = getTasks()
  const approvals = getApprovals()
  // @ts-ignore
  const accessToken = session.accessToken as string | undefined

  const result = await syncToGoogleSheet(tasks, approvals, accessToken)
  return NextResponse.json(result)
}
