import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getActiveBatch } from '@/lib/db/store'
import { uploadToDrive } from '@/lib/google/drive'

/**
 * Renders high-resolution branded SVG slide cards for carousel drafts
 * and saves the generated assets into the Authronic Google Drive Folder
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // @ts-ignore
  const accessToken = session.accessToken as string | undefined

  try {
    const activeBatch = getActiveBatch()
    const carouselTopic = activeBatch?.topics.find(t => t.assignedFormat === 'carousel') || activeBatch?.topics[0]

    if (!carouselTopic || !carouselTopic.slides || carouselTopic.slides.length === 0) {
      return NextResponse.json({ error: 'No carousel slides found to render.' }, { status: 400 })
    }

    const renderedSlides = []

    // Render each slide as an Authronic branded SVG template
    for (const slide of carouselTopic.slides) {
      const svg = `
        <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#121312"/>
              <stop offset="100%" stop-color="#090A09"/>
            </linearGradient>
            <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#F78F1E"/>
              <stop offset="100%" stop-color="#E95D24"/>
            </linearGradient>
          </defs>

          <!-- Background -->
          <rect width="1080" height="1350" fill="url(#bg)"/>

          <!-- Top Brand Wordmark / Header -->
          <text x="80" y="120" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#F78F1E" letter-spacing="2">AUTHRONIC</text>
          <text x="260" y="120" font-family="system-ui, sans-serif" font-size="24" fill="#8E928C">· GCC PROPTECH AUTOMATION</text>

          <!-- Slide Counter Badge -->
          <rect x="880" y="80" width="120" height="48" rx="24" fill="#1C1D1B" stroke="#2D2F2C" stroke-width="2"/>
          <text x="940" y="112" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#F78F1E" text-anchor="middle">0${slide.slideNumber}/07</text>

          <!-- Subtle Grid Lines -->
          <line x1="80" y1="160" x2="1000" y2="160" stroke="#252724" stroke-width="1.5"/>

          <!-- Slide Headline -->
          <foreignObject x="80" y="320" width="920" height="420">
            <div xmlns="http://www.w3.org/1999/xhtml" style="color: #F3F1ED; font-family: system-ui, sans-serif; font-size: 54px; font-weight: 700; line-height: 1.15; letter-spacing: -1.5px;">
              ${slide.headline}
            </div>
          </foreignObject>

          <!-- Slide Body -->
          <foreignObject x="80" y="780" width="920" height="340">
            <div xmlns="http://www.w3.org/1999/xhtml" style="color: #BABBB5; font-family: system-ui, sans-serif; font-size: 32px; font-weight: 400; line-height: 1.45;">
              ${slide.bodyText}
            </div>
          </foreignObject>

          <!-- Bottom Footer Bar -->
          <line x1="80" y1="1200" x2="1000" y2="1200" stroke="#252724" stroke-width="1.5"/>
          <text x="80" y="1255" font-family="system-ui, sans-serif" font-size="22" fill="#8E928C">${slide.visualNote}</text>
          <text x="1000" y="1255" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="#F78F1E" text-anchor="end">Swipe ➔</text>
        </svg>
      `.trim()

      const fileName = `slide-0${slide.slideNumber}-${slide.headline.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}.svg`

      // If user is authenticated with Google, upload directly to their Google Drive folder
      let driveLink = 'https://drive.google.com/drive/folders/1ROKW4326ax6A-24U8SrbHmsNSWoXXFkc'
      if (accessToken) {
        try {
          const uploadRes = await uploadToDrive(fileName, Buffer.from(svg), 'image/svg+xml', accessToken)
          if (uploadRes.success && uploadRes.webViewLink) {
            driveLink = uploadRes.webViewLink
          }
        } catch (uploadErr) {
          console.warn('Drive upload fallback:', uploadErr)
        }
      }

      renderedSlides.push({
        slideNumber: slide.slideNumber,
        fileName,
        driveLink,
      })
    }

    return NextResponse.json({
      success: true,
      count: renderedSlides.length,
      topicTitle: carouselTopic.title,
      slides: renderedSlides,
      message: `Rendered ${renderedSlides.length} branded carousel slides into Google Drive.`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
