import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getProspects, createProspect } from '@/lib/db/store'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prospects = getProspects()
  return NextResponse.json({ prospects })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      company,
      contactName,
      contactTitle,
      city,
      country,
      businessType,
      stage,
      dealSize,
      fitScore,
      painHypothesis,
      nextAction,
      lastTouch,
    } = body

    if (!company || !city || !painHypothesis) {
      return NextResponse.json(
        { error: 'Company name, city, and pain hypothesis are required.' },
        { status: 400 }
      )
    }

    const newProspect = createProspect({
      company: company.trim(),
      contactName: (contactName || 'Unassigned Contact').trim(),
      contactTitle: contactTitle?.trim(),
      city: city || 'Dubai',
      country: country || (city === 'Doha' ? 'Qatar' : city === 'Riyadh' ? 'Saudi Arabia' : 'UAE'),
      businessType: businessType || 'Independent Real Estate Agency',
      stage: stage || 'Researching',
      dealSize: dealSize || '$5,000/mo',
      fitScore: Number(fitScore) || 4.2,
      painHypothesis: painHypothesis.trim(),
      nextAction: (nextAction || 'Market discovery & hypothesis verification').trim(),
      lastTouch: lastTouch || 'Today · Ingested',
    })

    return NextResponse.json({ success: true, prospect: newProspect })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
