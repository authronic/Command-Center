import { ResearchTopicRecord, CarouselSlide, VideoScene } from '@/lib/db/types'

export interface ParsedGeminiBatch {
  name: string
  topics: ResearchTopicRecord[]
}

/**
 * Normalizes country/territory text to allowed markets
 */
function normalizeMarket(marketRaw: string): 'Qatar' | 'UAE' | 'KSA' | 'GCC-General' {
  const m = marketRaw.toLowerCase()
  if (m.includes('saudi') || m.includes('riyadh') || m.includes('jeddah') || m.includes('ksa')) {
    return 'KSA'
  }
  if (m.includes('uae') || m.includes('dubai') || m.includes('abu dhabi')) {
    return 'UAE'
  }
  if (m.includes('qatar') || m.includes('doha') || m.includes('lusail')) {
    return 'Qatar'
  }
  return 'GCC-General'
}

/**
 * Parses raw Gemini Daily Content Report markdown into structured database topics
 */
export function parseGeminiReport(rawText: string, batchIdPrefix = `batch-gemini-${Date.now()}`): ParsedGeminiBatch {
  // Extract batch title
  const titleMatch = rawText.match(/###\s*Daily Content Report:\s*([^\n\r]+)/i)
  const batchName = titleMatch ? titleMatch[1].trim() : `Gemini Daily Report · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

  // Split into idea sections: "#### Idea 1:", "#### Idea 2:", etc.
  const ideaSections = rawText.split(/####\s*Idea\s*\d+[:\s]*/i).slice(1)

  const topics: ResearchTopicRecord[] = []

  ideaSections.forEach((section, index) => {
    const id = `top-gem-${index + 1}`

    // Format detection
    const firstLine = section.split('\n')[0] || ''
    let format: 'carousel' | 'video' | 'static' = 'static'
    if (/carousel/i.test(firstLine) || /carousel/i.test(section.substring(0, 100))) {
      format = 'carousel'
    } else if (/video/i.test(firstLine) || /video script/i.test(section.substring(0, 100))) {
      format = 'video'
    }

    // Title / Finding
    const titleMatch =
      section.match(/\*\*(?:Title\s*\/\s*(?:Finding|Framework|Angle)):\*\*\s*([^\n\r*]+)/i) ||
      section.match(/\*\*Title:\*\*\s*([^\n\r*]+)/i)
    const title = titleMatch ? titleMatch[1].trim() : `Content Asset #${index + 1}`

    // Target Market
    const marketMatch = section.match(/\*\*Target Market:\*\*\s*([^\n\r*]+)/i)
    const market = normalizeMarket(marketMatch ? marketMatch[1].trim() : 'GCC-General')

    // Target Angle / Hypothesis
    const angleMatch =
      section.match(/\*\*(?:Target Angle\s*\/\s*Hypothesis|Target Angle|Hypothesis):\*\*\s*([^\n\r]+)/i)
    const targetAngle = angleMatch ? angleMatch[1].trim() : title

    // Source Reference / Topic Link
    const sourceMatch = section.match(/\*\*(?:Source Reference\s*\/\s*Topic Link|Source Reference|Topic Link):\*\*\s*([^\n\r]+)/i)
    const sourceUrl = sourceMatch ? sourceMatch[1].trim() : 'https://authronic.com/research'

    // Format specific parsing
    let slides: CarouselSlide[] | undefined
    let scenes: VideoScene[] | undefined
    let staticCopy: any

    if (format === 'carousel') {
      slides = []
      // Match slide headlines: "* **Slide 1:** Headline" or "**Slide 1 (CTA):** Headline"
      const slideMatches = [...section.matchAll(/\*\*(?:Slide\s*(\d+)[^:*]*):\*\*\s*([^\n\r]+)/gi)]
      if (slideMatches.length > 0) {
        slideMatches.forEach((sm, sIdx) => {
          const slideNumber = parseInt(sm[1]) || sIdx + 1
          const headline = sm[2].trim().replace(/\$\\rightarrow\$/g, '→').replace(/\$/g, '')
          slides!.push({
            slideNumber,
            headline,
            bodyText:
              sIdx === 0
                ? 'High-impact breakdown for enterprise GCC brokerages and developers.'
                : sIdx === slideMatches.length - 1
                ? 'Comment below to receive the complete production workflow blueprint.'
                : 'Automated event-driven architecture capturing intent and triaging leads in real-time.',
            visualNote:
              sIdx === 0
                ? 'Cover Slide · Authronic Dark/Orange Theme'
                : sIdx === slideMatches.length - 1
                ? 'End CTA Card'
                : 'Architecture Diagram / Key Metric',
          })
        })
      } else {
        // Fallback default 7 slides
        slides = Array.from({ length: 7 }, (_, i) => ({
          slideNumber: i + 1,
          headline: `Slide ${i + 1}: ${title}`,
          bodyText: 'High-impact enterprise automation insight for GCC real estate.',
          visualNote: i === 0 ? 'Cover Slide' : i === 6 ? 'CTA End Card' : 'System Visual',
        }))
      }
    } else if (format === 'video') {
      scenes = []
      // Match scenes: e.g. "* **0:00–0:15s (Hook):**" or "**0:15–0:45s (Core Insight):**"
      const sceneMatches = [...section.matchAll(/\*\*(\d+:\d+[–\-]\d+:\d+s?)\s*\(([^)]+)\):\*\*\s*([\s\S]*?)(?=(?:\*\*\d+:\d+|$|\n\s*---))/gi)]
      if (sceneMatches.length > 0) {
        sceneMatches.forEach((sc, scIdx) => {
          const timeRange = sc[1].trim()
          const label = sc[2].trim()
          const rawBlock = sc[3].trim()

          // Extract visual action inside parentheses *(Avatar ...)*
          const visualActionMatch = rawBlock.match(/\*\(([^)]+)\)\*/)
          const visualAction = visualActionMatch ? visualActionMatch[1].trim() : label

          // Clean speaker text
          let speakerText = rawBlock.replace(/\*\([^)]+\)\*/g, '').replace(/"/g, '').trim()
          speakerText = speakerText.replace(/\$\\rightarrow\$/g, '→').replace(/\$/g, '')

          scenes!.push({
            sceneNumber: scIdx + 1,
            timestampRange: timeRange,
            visualAction,
            speakerText: speakerText || `${label} commentary on GCC property automation.`,
          })
        })
      } else {
        scenes = [
          {
            sceneNumber: 1,
            timestampRange: '0:00–0:15s',
            visualAction: 'Avatar center frame, sharp modern architectural backdrop',
            speakerText: `If your agency treats luxury inquiries with generic manual replies, you are losing high-net-worth deals every single day.`,
          },
          {
            sceneNumber: 2,
            timestampRange: '0:15–0:45s',
            visualAction: 'Split screen: Incoming inquiry triage card',
            speakerText: `Top GCC developers use conversational triage to verify eligibility, timeline, and budget within 90 seconds.`,
          },
          {
            sceneNumber: 3,
            timestampRange: '0:45–1:00s',
            visualAction: 'Lower third CTA card',
            speakerText: `Comment below to get our private VIP triage workflow and lead pipeline template.`,
          },
        ]
      }
    } else {
      // Static post
      const hookMatch = section.match(/\*\*Hook Headline:\*\*\s*(?:\*\*)?([^\n\r*]+)(?:\*\*)?/i)
      const hook = hookMatch ? hookMatch[1].trim().replace(/\*\*/g, '') : title

      let bodyCopy = ''
      const bodyMatch = section.match(/\*\*Body Copy:\*\*\s*([\s\S]*?)(?=(?:---|\n\s*####|$))/i)
      if (bodyMatch) {
        bodyCopy = bodyMatch[1].trim()
      } else {
        bodyCopy = targetAngle
      }

      staticCopy = {
        hook,
        body: bodyCopy,
        cta: 'Save this post and visit authronic.com for our complete GCC integration guides.',
        hashtags: ['#GCCRealEstate', '#PropTech', `#${market.replace('-', '')}Property`, '#Automation', '#Authronic'],
      }
    }

    topics.push({
      id,
      batchId: batchIdPrefix,
      title,
      sourceUrl,
      relevanceScore: Math.round((4.9 - index * 0.1) * 10) / 10,
      assignedFormat: format,
      targetAngle,
      market,
      status: 'allocated',
      slides,
      scenes,
      staticCopy,
    })
  })

  return {
    name: batchName,
    topics,
  }
}
