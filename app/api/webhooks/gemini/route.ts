import { NextRequest, NextResponse } from 'next/server'
import { createContentBatch, getActiveBatch, getTasks, convertBatchToApprovals } from '@/lib/db/store'
import { syncToGoogleSheet } from '@/lib/google/sheets'
import { parseGeminiReport } from '@/lib/gemini/parser'

/**
 * GET /api/webhooks/gemini
 * Public status check, schema documentation, and active batch preview
 */
export async function GET(request: NextRequest) {
  const activeBatch = getActiveBatch()
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/webhooks/gemini',
    description: 'Autonomous webhook endpoint for Google Gemini daily reports, n8n workflows, or Apps Script crons',
    supportedPayloads: [
      {
        type: 'Raw Markdown',
        contentType: 'text/plain or text/markdown',
        example: '### Daily Content Report: GCC Real Estate Automation ...',
      },
      {
        type: 'JSON with text field',
        contentType: 'application/json',
        example: { text: '### Daily Content Report: GCC Real Estate Automation ...' },
      },
      {
        type: 'Structured JSON',
        contentType: 'application/json',
        example: { name: 'Batch Name', topics: [] },
      },
    ],
    currentBatch: {
      id: activeBatch?.id,
      name: activeBatch?.name,
      topicsCount: activeBatch?.topics?.length || 0,
      createdAt: activeBatch?.createdAt,
      topics: activeBatch?.topics || [],
    },
  })
}

/**
 * POST /api/webhooks/gemini
 * Ingests Gemini daily reports from webhooks, n8n, Google Apps Script, or copy-paste
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let batchName = ''
    let topics: any[] = []

    if (contentType.includes('application/json')) {
      const body = await request.json()
      // If structured JSON with { name, topics }
      if (body.name && Array.isArray(body.topics)) {
        batchName = body.name
        topics = body.topics
      } else if (body.text || body.markdown || body.content || body.report) {
        // JSON containing raw markdown text
        const rawText = body.text || body.markdown || body.content || body.report
        const parsed = parseGeminiReport(rawText)
        batchName = parsed.name
        topics = parsed.topics
      } else {
        return NextResponse.json(
          { error: 'Invalid JSON payload. Provide { name, topics } or { text: string }.' },
          { status: 400 }
        )
      }
    } else {
      // Raw plain text or markdown body
      const rawText = await request.text()
      if (!rawText || rawText.trim().length === 0) {
        return NextResponse.json({ error: 'Empty payload received' }, { status: 400 })
      }
      const parsed = parseGeminiReport(rawText)
      batchName = parsed.name
      topics = parsed.topics
    }

    if (!batchName || topics.length === 0) {
      return NextResponse.json(
        { error: 'Could not parse content topics from payload' },
        { status: 400 }
      )
    }

    // Persist into database store
    const batch = createContentBatch(batchName, topics)
    try {
      convertBatchToApprovals(batch.id)
    } catch {
      // Ignore if already drafted
    }

    // Format content topics into approval records for Google Sheet sync
    const contentApprovals = topics.map(t => ({
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

    // Background sync to Google Sheet
    let sheetResult = null
    try {
      const tasks = getTasks()
      sheetResult = await syncToGoogleSheet(tasks, contentApprovals)
    } catch (sheetErr: any) {
      console.warn('Background sheet sync notice:', sheetErr)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ingested Gemini batch "${batchName}" (${topics.length} topics) into database.`,
      batchId: batch.id,
      topicsCount: topics.length,
      topics: topics.map(t => ({ id: t.id, title: t.title, format: t.assignedFormat, market: t.market })),
      sheetSync: sheetResult,
    })
  } catch (err: any) {
    console.error('Gemini webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
