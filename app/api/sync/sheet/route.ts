import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getTasks, getApprovals, getActiveBatch } from '@/lib/db/store'
import { syncToGoogleSheet, readFromGoogleSheet, formatApprovalsForSheet } from '@/lib/google/sheets'

/**
 * Two-way Google Sheets Sync API
 * POST: Pushes database tasks, approvals, and Gemini content topics to Google Sheet
 * GET: Reads current rows and provides formatted rows for Apps Script sync
 */
export async function POST(request: NextRequest) {
  const session = await auth()

  // @ts-ignore
  const accessToken = session?.accessToken as string | undefined

  const tasks = getTasks()
  const approvals = getApprovals()
  const activeBatch = getActiveBatch()

  // Format content topics into approval records for spreadsheet representation
  const contentApprovals = [
    ...approvals,
    ...(activeBatch?.topics || []).map(t => ({
      id: t.id,
      title: t.title,
      format: (t.assignedFormat === 'carousel' ? 'Carousel' : t.assignedFormat === 'video' ? 'Video' : 'Static Post') as any,
      market: t.market,
      author: 'Google Gemini Pro',
      version: 'v1.0',
      summary: t.targetAngle,
      claims: [t.sourceUrl],
      status: 'pending' as any,
      submittedAt: 'Today',
    }))
  ]

  const result = await syncToGoogleSheet(tasks, contentApprovals, accessToken)
  return NextResponse.json(result)
}

export async function GET(request: NextRequest) {
  const session = await auth()

  // @ts-ignore
  const accessToken = session?.accessToken as string | undefined

  const tasks = getTasks()
  const approvals = getApprovals()
  const activeBatch = getActiveBatch()

  const contentApprovals = [
    ...approvals,
    ...(activeBatch?.topics || []).map(t => ({
      id: t.id,
      title: t.title,
      format: (t.assignedFormat === 'carousel' ? 'Carousel' : t.assignedFormat === 'video' ? 'Video' : 'Static Post') as any,
      market: t.market,
      author: 'Google Gemini Pro',
      version: 'v1.0',
      summary: t.targetAngle,
      claims: [t.sourceUrl],
      status: 'pending' as any,
      submittedAt: 'Today',
    }))
  ]

  const formattedRows = formatApprovalsForSheet(contentApprovals)
  const sheetResult = await readFromGoogleSheet(accessToken)

  return NextResponse.json({
    success: true,
    sheetId: process.env.GOOGLE_SHEET_ID || '146tzKMldWAayotPPACLJFXM4LDJhVsrF2ccmdMbDwv4',
    liveRows: formattedRows,
    sheetApiRead: sheetResult,
    topicsCount: contentApprovals.length,
    activeBatch,
  })
}
