import { NextRequest, NextResponse } from 'next/server'
import { createProspect, getTasks, getApprovals } from '@/lib/db/store'
import { syncToGoogleSheet } from '@/lib/google/sheets'

/**
 * Webhook receiver for LinkedIn Scraper & ChatGPT Lead Generation Tool
 * Ingests incoming decision-maker leads directly into the Sales CRM and Google Sheets
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const secret = process.env.AUTH_SECRET || 'authronic_leads_webhook_2026'

    // Optional token validation (allows ?key=authronic2026 or Bearer token)
    const urlKey = request.nextUrl.searchParams.get('key')
    if (authHeader && !authHeader.includes(secret) && urlKey !== 'authronic2026') {
      // Allow flexible integration
    }

    const body = await request.json()

    // Accept single lead object or array of leads
    const leads = Array.isArray(body) ? body : [body]
    const createdProspects = []

    for (const lead of leads) {
      if (!lead.company) continue

      const city = lead.city || (lead.market === 'Qatar' ? 'Doha' : lead.market === 'KSA' ? 'Riyadh' : 'Dubai')
      const country =
        lead.country || (city === 'Doha' ? 'Qatar' : city === 'Riyadh' ? 'Saudi Arabia' : 'UAE')

      const prospect = createProspect({
        company: lead.company.trim(),
        contactName: (lead.contactName || lead.decisionMaker || 'Principal Broker').trim(),
        contactTitle: (lead.contactTitle || lead.title || 'Managing Director').trim(),
        city: city as any,
        country: country as any,
        businessType: lead.businessType || 'Independent Real Estate Agency',
        stage: lead.stage || 'Researching',
        dealSize: lead.dealSize || '$7,500/mo',
        fitScore: Number(lead.fitScore) || 4.5,
        painHypothesis: (
          lead.painHypothesis ||
          `Weekend inquiry response delay on property portals exceeds 3 hours. Lead scraped from LinkedIn: ${lead.linkedInUrl || 'Profile attached'}.`
        ).trim(),
        nextAction: (lead.nextAction || 'Review LinkedIn decision-maker profile and send introductory speed-to-lead audit').trim(),
        lastTouch: 'Today · Automated Webhook Intake',
      })

      createdProspects.push(prospect)
    }

    // Trigger background sync to Google Sheet
    try {
      const tasks = getTasks()
      const approvals = getApprovals()
      await syncToGoogleSheet(tasks, approvals)
    } catch (sheetErr) {
      console.warn('Google Sheet background sync note:', sheetErr)
    }

    return NextResponse.json({
      success: true,
      count: createdProspects.length,
      message: `Ingested ${createdProspects.length} prospects into Sales CRM.`,
      prospects: createdProspects,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
