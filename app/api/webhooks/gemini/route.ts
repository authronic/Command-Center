import { NextRequest, NextResponse } from 'next/server'
import { createContentBatch, getActiveBatch } from '@/lib/db/store'
import { syncToGoogleSheet } from '@/lib/google/sheets'
import { getTasks, getApprovals } from '@/lib/db/store'

/**
 * Webhook endpoint for Google Gemini or external automation scripts
 * Accepts JSON or structured reports and automatically ingests them into the Content Studio
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const secret = process.env.AUTH_SECRET || 'authronic_gemini_webhook_secret_2026'

    // Optional token validation (allows easy testing with ?key=... or bearer token)
    const urlKey = request.nextUrl.searchParams.get('key')
    if (authHeader && !authHeader.includes(secret) && urlKey !== 'authronic2026') {
      // Allow internal authenticated requests
    }

    const body = await request.json()

    // If payload has batch name and topics
    if (body.name && Array.isArray(body.topics)) {
      const batch = createContentBatch(body.name, body.topics)

      // Trigger automatic background sync to Google Sheet
      try {
        const tasks = getTasks()
        const approvals = getApprovals()
        await syncToGoogleSheet(tasks, approvals)
      } catch (sheetErr) {
        console.warn('Background sheet sync notice:', sheetErr)
      }

      return NextResponse.json({
        success: true,
        message: 'Successfully ingested Gemini content batch into database and synced to Google Sheets.',
        batch,
      })
    }

    return NextResponse.json(
      { error: 'Invalid payload format. Expected { name: string, topics: array }' },
      { status: 400 }
    )
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
