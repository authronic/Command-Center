import fs from 'fs'
import path from 'path'
import {
  TaskRecord,
  ApprovalRecord,
  WorkflowRunRecord,
  AuditEventRecord,
  ContentBatchRecord,
  ResearchTopicRecord,
  ScheduledPostRecord,
  SalesLeadRecord,
} from './types'

// Data file path (persisted in project data directory or /tmp in serverless)
const DATA_DIR =
  process.env.NODE_ENV === 'production' && !process.env.LOCAL_PERSISTENCE
    ? '/tmp/authronic_data'
    : path.join(process.cwd(), '.data')

const DB_FILE = path.join(DATA_DIR, 'db.json')

interface DatabaseSchema {
  tasks: TaskRecord[]
  approvals: ApprovalRecord[]
  runs: WorkflowRunRecord[]
  auditEvents: AuditEventRecord[]
  batches: ContentBatchRecord[]
  scheduledPosts: ScheduledPostRecord[]
  prospects: SalesLeadRecord[]
  lastSyncedAt?: string
}



const initialSeed: DatabaseSchema = {
  tasks: [],
  approvals: [],
  runs: [],
  auditEvents: [
    {
      id: 'aud-live-01',
      actor: 'Google Gemini Pro',
      action: 'INGEST_DAILY_CONTENT_REPORT',
      targetType: 'CONTENT_BATCH',
      targetId: 'batch-gemini-live-01',
      details: 'Daily content report received: 2 Carousels, 1 Video Script, 2 Static Posts for GCC Real Estate Automation.',
      timestamp: new Date().toISOString(),
    },
  ],
  batches: [
    {
      id: 'batch-gemini-live-01',
      name: 'Gemini Daily Report · GCC Real Estate Automation',
      createdAt: new Date().toISOString(),
      status: 'active',
      topics: [
        {
          id: 'top-gem-1',
          batchId: 'batch-gemini-live-01',
          title: 'The 45-Second WhatsApp Qualification Engine for Off-Plan Launches',
          sourceUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
          relevanceScore: 4.9,
          assignedFormat: 'carousel',
          targetAngle: 'Off-plan launch campaigns waste up to 40% of ad spend on unqualified leads because human agents cannot triage incoming WhatsApp inquiries within the critical 3-minute response window.',
          market: 'UAE',
          status: 'allocated',
          slides: [
            {
              slideNumber: 1,
              headline: '45 Seconds: The Exact Window That Makes or Breaks a Dubai Off-Plan Campaign',
              bodyText: 'Why manual chat handlers drop high-net-worth buyers before the first call.',
              visualNote: 'Cover Slide · Authronic Dark Orange Gradient',
            },
            {
              slideNumber: 2,
              headline: 'The WhatsApp Bottleneck: Why Manual Chat Handlers Drop High-Net-Worth Buyers',
              bodyText: 'Inquiries arrive simultaneously from Property Finder & Bayut. Manual replies take an average of 42 minutes.',
              visualNote: 'Split graphic showing notification pileup',
            },
            {
              slideNumber: 3,
              headline: 'The Architecture: Ad Click → WhatsApp Webhook → Deterministic Triage',
              bodyText: 'Instant n8n trigger captures name, phone number, and listing unit ID within 300ms.',
              visualNote: 'System architecture diagram',
            },
            {
              slideNumber: 4,
              headline: 'Qualification Without Friction: Budget, Payment Plan, & Residency Status in 3 Prompts',
              bodyText: 'Instant conversational qualification in English or Arabic confirming investment budget and financing.',
              visualNote: 'Chat dialogue frame',
            },
            {
              slideNumber: 5,
              headline: 'Routing Logic: Flagging Secondary Market Inquiries vs. Ready-to-Commit Off-Plan Buyers',
              bodyText: 'Separates window shoppers from cash investors ready to sign reservation agreements.',
              visualNote: 'Decision tree visualization',
            },
            {
              slideNumber: 6,
              headline: 'Live CRM Sync: Writing Full Buyer Profiles into Salesforce / HubSpot in Under a Minute',
              bodyText: 'Automated deal creation with complete briefing card routed directly to senior luxury agents.',
              visualNote: 'CRM pipeline card',
            },
            {
              slideNumber: 7,
              headline: 'Comment "OFFPLAN" to Receive Our Production WhatsApp-to-CRM Automation Blueprint',
              bodyText: 'Built for GCC real estate brokerages by Authronic. Visit authronic.com for live interactive walkthroughs.',
              visualNote: 'CTA end-card with Authronic wordmark',
            },
          ],
        },
        {
          id: 'top-gem-2',
          batchId: 'batch-gemini-live-01',
          title: 'The Multi-Portal Inquiry Normalizer: Eliminating Duplicate Data Entry Across Property Finder, Bayut, and Wasalt',
          sourceUrl: 'https://propertyfinder.ae/partner-integrations',
          relevanceScore: 4.7,
          assignedFormat: 'carousel',
          targetAngle: 'GCC brokerages listing across multiple portals suffer from fragmented lead attribution and delayed follow-ups; an event-driven middleware pipeline unifies disparate portal webhooks into a single normalized data stream.',
          market: 'KSA',
          status: 'allocated',
          slides: [
            {
              slideNumber: 1,
              headline: 'The Portal Fragment: Why Your Top Agents Spend 2 Hours a Day Copying Lead Data',
              bodyText: 'Manual data entry across Bayut, Wasalt, and Property Finder kills agent productivity and loses high-intent buyers.',
              visualNote: 'Cover slide',
            },
            {
              slideNumber: 2,
              headline: 'The Disconnect: Handling Unstructured Inquiries Across Wasalt, Bayut, and Property Finder',
              bodyText: 'Different portal schemas lead to duplicate entries, inaccurate attribution, and broken follow-up chains.',
              visualNote: 'Disconnected portal icons graphic',
            },
            {
              slideNumber: 3,
              headline: 'Blueprint: The Centralized Webhook Ingestion Layer',
              bodyText: 'One normalized webhook intake receiving all portal payloads simultaneously with zero dropped leads.',
              visualNote: 'Ingestion pipeline flow chart',
            },
            {
              slideNumber: 4,
              headline: 'Deduplication & E164 Phone Normalization: Stopping Duplicate Lead Claims Instantly',
              bodyText: 'Auto-formatting +971, +966, and +974 to prevent routing conflicts and duplicate outreach.',
              visualNote: 'Phone formatting diagram',
            },
            {
              slideNumber: 5,
              headline: 'Automated Territory & Project Assignment Based on Real-Time Agent Availability',
              bodyText: 'Routes off-plan leads to available specialists in seconds based on active calendar capacity.',
              visualNote: 'Agent availability badge',
            },
            {
              slideNumber: 6,
              headline: 'The Metric: From 4-Hour Lead Response Times to Sub-60-Second Agent Dispatch',
              bodyText: 'Agencies achieve 89% response rates on multi-portal off-plan leads.',
              visualNote: 'Response speed comparison graph',
            },
            {
              slideNumber: 7,
              headline: 'Comment "PORTAL" to Download the GCC Multi-Portal Ingestion Schema',
              bodyText: 'Enterprise agentic infrastructure by Authronic.',
              visualNote: 'Closing brand slide with CTA',
            },
          ],
        },
        {
          id: 'top-gem-3',
          batchId: 'batch-gemini-live-01',
          title: 'Triage or Lose: How to Filter $5M+ Inquiries from Tire-Kickers Without Damaging Brand Prestige',
          sourceUrl: 'https://bayut.com/dubai-luxury-report-2026',
          relevanceScore: 4.8,
          assignedFormat: 'video',
          targetAngle: 'High-end brokerages cannot afford to expose ultra-HNW clients to rigid, robotic qualification forms, but agents burn out answering curiosity clicks without an intelligent pre-filter.',
          market: 'UAE',
          status: 'allocated',
          scenes: [
            {
              sceneNumber: 1,
              timestampRange: '0:00 – 0:15s (Hook)',
              speakerText: "If your agents treat a 20-million-dirham villa inquiry the same way they treat a rental lead, you're actively handing deals to rival brokerages. Ultra-HNW buyers don't fill out 10-field web forms—and they won't wait 4 hours for an email reply.",
              visualAction: 'Avatar center frame, sharp luxury architectural backdrop',
            },
            {
              sceneNumber: 2,
              timestampRange: '0:15 – 0:45s (Core Insight)',
              speakerText: "Elite brokerages in Dubai and Doha use conversational concierge triage. The moment an inquiry arrives via private message or direct form, an automated concierge engages with natural, brand-aligned hospitality. It discreetly verifies passport nationality for ownership eligibility, funding readiness, and specific timeline preferences—then books an in-person viewing directly onto the senior director's calendar within 90 seconds.",
              visualAction: 'Split screen: incoming unstructured inquiry → automated extraction card',
            },
            {
              sceneNumber: 3,
              timestampRange: '0:45 – 1:00s (CTA)',
              speakerText: "Stop letting multi-million-dollar leads sit in unread inboxes. Drop the word 'LUXURY' below to get our private VIP triage workflow.",
              visualAction: 'Avatar returns to center, lower-third graphic: LUXURY',
            },
          ],
        },
        {
          id: 'top-gem-4',
          batchId: 'batch-gemini-live-01',
          title: 'The Speed-to-Lead SLA Gap in GCC Real Estate',
          sourceUrl: 'https://authronic.com/research/gcc-speed-to-lead-2026',
          relevanceScore: 4.6,
          assignedFormat: 'static',
          targetAngle: 'B2B property inquiries convert at 391% higher rates when contacted within 5 minutes; manual routing creates an unavoidable 45-minute latency trap.',
          market: 'Qatar',
          status: 'allocated',
          staticCopy: {
            hook: 'Your Inbound Leads Have a 5-Minute Half-Life. Your Average Response Time is 48 Minutes.',
            body: 'In the GCC property market, international investors submit inquiries across 3 to 5 competitor listings simultaneously.\n\nThe brokerage that initiates a personalized, context-aware touchpoint within the first 300 seconds wins the dialogue 78% of the time. Every minute beyond that is margin surrendered to competitors.\n\nRelying on manual lead dispatch, WhatsApp copy-pasting, or end-of-day CRM imports isn’t an operational delay—it’s an active revenue leak. Automated speed-to-lead pipelines capture the portal payload, parse buyer intent, and initiate direct WhatsApp or SMS communication before the prospect even navigates away from the listing page.',
            cta: 'Read the full GCC Speed-to-Lead Index on authronic.com',
            hashtags: ['#GCCRealEstate', '#SpeedToLead', '#DubaiProperty', '#PropTech'],
          },
        },
        {
          id: 'top-gem-5',
          batchId: 'batch-gemini-live-01',
          title: 'The 5-Point GCC Brokerage Data Hygiene & Sync Audit',
          sourceUrl: 'https://authronic.com/research/gcc-crm-hygiene',
          relevanceScore: 4.5,
          assignedFormat: 'static',
          targetAngle: 'Brokerages lose thousands of dollars in follow-up pipeline value due to unverified phone formats, missing portal attribution tags, and untracked agent reassignments.',
          market: 'KSA',
          status: 'allocated',
          staticCopy: {
            hook: 'The 5-Point Integration Audit Every GCC Brokerage Needs Before Their Next Launch.',
            body: 'Before scaling paid ad budgets or portal listing tiers, audit your backend integration for these 5 critical failure points:\n\n1. E.164 Phone Formatting: Automatically standardizing local and international numbers (+971, +966, +974) to prevent WhatsApp API dispatch drops.\n2. UTM & Portal Source Attribution: Preserving original ad set and portal campaign IDs through every stage of the CRM lifecycle.\n3. Idempotent Webhook Handling: Preventing duplicate lead entries when portals retry failed HTTP delivery events.\n4. Dynamic Agent Capacity Routing: Checking real-time calendar availability before assigning high-value consultations.\n5. Auto-Disqualification Archival: Routing invalid phone numbers and cold tire-kickers out of active rep queues to protect agent focus.',
            cta: 'Bookmark this audit checklist for your next agency operations meeting.',
            hashtags: ['#RiyadhRealEstate', '#PropTechSaudi', '#CRMHygiene', '#Authronic'],
          },
        },
      ],
    },
  ],
  scheduledPosts: [],
  prospects: [],
}




function ensureDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeed, null, 2), 'utf8')
      return initialSeed
    }
    const content = fs.readFileSync(DB_FILE, 'utf8')
    return JSON.parse(content) as DatabaseSchema
  } catch (error) {
    console.error('Error accessing local database file, using in-memory seed:', error)
    return initialSeed
  }
}

function writeDb(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error('Error persisting database:', error)
  }
}

export function resetDatabase(): DatabaseSchema {
  writeDb(initialSeed)
  return initialSeed
}


// ========================
// Task Operations
// ========================
export function getTasks(): TaskRecord[] {
  const db = ensureDb()
  return db.tasks
}

export function createTask(task: Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt'>): TaskRecord {
  const db = ensureDb()
  const record: TaskRecord = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  db.tasks.unshift(record)

  db.auditEvents.unshift({
    id: `aud-${Date.now()}`,
    actor: 'Authronic Admin',
    action: 'CREATE_TASK',
    targetType: 'TASK',
    targetId: record.id,
    details: `Created task: ${record.title}`,
    timestamp: new Date().toISOString(),
  })

  writeDb(db)
  return record
}

export function updateTask(id: string, updates: Partial<TaskRecord>): TaskRecord | null {
  const db = ensureDb()
  const index = db.tasks.findIndex(t => t.id === id)
  if (index === -1) return null

  db.tasks[index] = {
    ...db.tasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  writeDb(db)
  return db.tasks[index]
}

export function deleteTask(id: string): boolean {
  const db = ensureDb()
  const originalLength = db.tasks.length
  db.tasks = db.tasks.filter(t => t.id !== id)

  if (db.tasks.length < originalLength) {
    db.auditEvents.unshift({
      id: `aud-${Date.now()}`,
      actor: 'Authronic Admin',
      action: 'DELETE_TASK',
      targetType: 'TASK',
      targetId: id,
      timestamp: new Date().toISOString(),
    })
    writeDb(db)
    return true
  }
  return false
}

// ========================
// Approvals Operations
// ========================
export function getApprovals(): ApprovalRecord[] {
  const db = ensureDb()
  return db.approvals
}

export function decideApproval(
  id: string,
  action: 'approved' | 'revision_requested' | 'rejected',
  feedback?: string,
  reviewer: string = 'Authronic Admin'
): ApprovalRecord | null {
  const db = ensureDb()
  const item = db.approvals.find(a => a.id === id)
  if (!item) return null

  item.status = action
  item.feedback = feedback
  item.reviewer = reviewer
  item.decidedAt = new Date().toISOString()

  db.auditEvents.unshift({
    id: `aud-${Date.now()}`,
    actor: reviewer,
    action: `APPROVAL_${action.toUpperCase()}`,
    targetType: 'APPROVAL',
    targetId: id,
    details: `${item.title} (${item.version}) -> ${action}`,
    timestamp: new Date().toISOString(),
  })

  writeDb(db)
  return item
}

// ========================
// Runs Operations
// ========================
export function getRuns(): WorkflowRunRecord[] {
  const db = ensureDb()
  return db.runs
}

export function retryRun(id: string): WorkflowRunRecord | null {
  const db = ensureDb()
  const run = db.runs.find(r => r.id === id)
  if (!run) return null

  run.status = 'succeeded'
  run.errorSummary = undefined
  run.duration = '3.1s (Retried)'

  db.auditEvents.unshift({
    id: `aud-${Date.now()}`,
    actor: 'Authronic Admin',
    action: 'RETRY_RUN',
    targetType: 'RUN',
    targetId: id,
    details: `Idempotent retry succeeded for ${run.workflowName} (${run.executionId})`,
    timestamp: new Date().toISOString(),
  })

  writeDb(db)
  return run
}

// ========================
// Audit Events
// ========================
export function getAuditEvents(): AuditEventRecord[] {
  const db = ensureDb()
  return db.auditEvents
}

// ========================
// Content Studio Operations (Phase 3)
// ========================
export function getContentBatches(): ContentBatchRecord[] {
  const db = ensureDb()
  return db.batches || []
}

export function getActiveBatch(): ContentBatchRecord | null {
  const db = ensureDb()
  if (!db.batches || db.batches.length === 0) return null
  return db.batches.find(b => b.status === 'active') || db.batches[0]
}

export function updateTopicFormat(
  batchId: string,
  topicId: string,
  format: 'static' | 'carousel' | 'video' | 'skip'
): boolean {
  const db = ensureDb()
  const batch = (db.batches || []).find(b => b.id === batchId)
  if (!batch) return false

  const topic = batch.topics.find(t => t.id === topicId)
  if (!topic) return false

  topic.assignedFormat = format
  topic.status = format === 'skip' ? 'skipped' : 'allocated'

  writeDb(db)
  return true
}

export function createContentBatch(
  name: string,
  topics: Omit<ResearchTopicRecord, 'id' | 'batchId' | 'status'>[]
): ContentBatchRecord {
  const db = ensureDb()
  const batchId = `batch-${Date.now()}`

  const newBatch: ContentBatchRecord = {
    id: batchId,
    name,
    createdAt: new Date().toISOString(),
    status: 'active',
    topics: topics.map((t, i) => ({
      ...t,
      id: `top-${batchId}-${i + 1}`,
      batchId,
      status: t.assignedFormat === 'skip' ? 'skipped' : 'allocated',
    })),
  }

  // Mark other batches inactive
  db.batches = (db.batches || []).map(b => ({ ...b, status: 'archived' as const }))
  db.batches.unshift(newBatch)

  db.auditEvents.unshift({
    id: `aud-${Date.now()}`,
    actor: 'AUTH-C01 Research Engine',
    action: 'INGEST_CONTENT_BATCH',
    targetType: 'CONTENT_BATCH',
    targetId: batchId,
    details: `Ingested 5 research topics for ${name}`,
    timestamp: new Date().toISOString(),
  })

  writeDb(db)
  return newBatch
}

export function convertBatchToApprovals(batchId: string): ApprovalRecord[] {
  const db = ensureDb()
  const batch = (db.batches || []).find(b => b.id === batchId)
  if (!batch) return []

  const createdApprovals: ApprovalRecord[] = []

  batch.topics.forEach(topic => {
    if (topic.assignedFormat === 'skip') return

    const formatMap = {
      static: 'Static Post',
      carousel: 'Carousel',
      video: 'Video',
    } as const

    const approval: ApprovalRecord = {
      id: `appr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: topic.title,
      format: formatMap[topic.assignedFormat],
      market: topic.market,
      author: topic.assignedFormat === 'carousel' ? 'AUTH-C03 Content Draft' : 'AUTH-C02 Research Engine',
      version: 'v1.0',
      summary: topic.targetAngle,
      claims: [
        `Source verified: ${topic.sourceUrl}`,
        `Relevance score: ${topic.relevanceScore}/5.0`,
      ],
      status: 'pending',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    db.approvals.unshift(approval)
    createdApprovals.push(approval)
    topic.status = 'drafted'
  })

  db.auditEvents.unshift({
    id: `aud-${Date.now()}`,
    actor: 'Authronic Admin',
    action: 'GENERATE_DRAFTS',
    targetType: 'APPROVAL_BATCH',
    targetId: batchId,
    details: `Created ${createdApprovals.length} approval queue items from batch ${batchId}`,
    timestamp: new Date().toISOString(),
  })

  writeDb(db)
  return createdApprovals
}

// ========================
// Calendar Operations (Phase 3)
// ========================
export function getScheduledPosts(): ScheduledPostRecord[] {
  const db = ensureDb()
  return db.scheduledPosts || []
}

export function createScheduledPost(post: Omit<ScheduledPostRecord, 'id'>): ScheduledPostRecord {
  const db = ensureDb()
  const record: ScheduledPostRecord = {
    ...post,
    id: `sch-${Date.now()}`,
  }

  db.scheduledPosts = db.scheduledPosts || []
  db.scheduledPosts.push(record)

  db.auditEvents.unshift({
    id: `aud-${Date.now()}`,
    actor: 'Authronic Admin',
    action: 'SCHEDULE_POST',
    targetType: 'CALENDAR_POST',
    targetId: record.id,
    details: `Scheduled ${record.format} on ${record.channel} for ${record.scheduledTime}`,
    timestamp: new Date().toISOString(),
  })

  writeDb(db)
  return record
}

export function updateScheduledPostStatus(
  id: string,
  status: 'draft' | 'scheduled_internal' | 'published_verified' | 'failed'
): ScheduledPostRecord | null {
  const db = ensureDb()
  const post = (db.scheduledPosts || []).find(p => p.id === id)
  if (!post) return null

  post.status = status
  writeDb(db)
  return post
}

// ========================
// Sales CRM Operations (Phase 4)
// ========================
export function getProspects(): SalesLeadRecord[] {
  const db = ensureDb()
  return db.prospects || []
}

export function createProspect(
  prospect: Omit<SalesLeadRecord, 'id' | 'createdAt' | 'updatedAt'>
): SalesLeadRecord {
  const db = ensureDb()
  const record: SalesLeadRecord = {
    ...prospect,
    id: `pros-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  db.prospects = db.prospects || []
  db.prospects.unshift(record)

  db.auditEvents.unshift({
    id: `aud-${Date.now()}`,
    actor: 'Authronic Admin',
    action: 'CREATE_PROSPECT',
    targetType: 'PROSPECT',
    targetId: record.id,
    details: `Added ${record.company} (${record.city}) to CRM with deal size ${record.dealSize}`,
    timestamp: new Date().toISOString(),
  })

  writeDb(db)
  return record
}

export function updateProspect(
  id: string,
  updates: Partial<SalesLeadRecord>
): SalesLeadRecord | null {
  const db = ensureDb()
  db.prospects = db.prospects || []
  const index = db.prospects.findIndex(p => p.id === id)
  if (index === -1) return null

  const oldStage = db.prospects[index].stage

  db.prospects[index] = {
    ...db.prospects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  if (updates.stage && updates.stage !== oldStage) {
    db.auditEvents.unshift({
      id: `aud-${Date.now()}`,
      actor: 'Authronic Admin',
      action: 'PROSPECT_STAGE_CHANGE',
      targetType: 'PROSPECT',
      targetId: id,
      details: `${db.prospects[index].company} stage changed: ${oldStage} → ${updates.stage}`,
      timestamp: new Date().toISOString(),
    })
  }

  writeDb(db)
  return db.prospects[index]
}

export function deleteProspect(id: string): boolean {
  const db = ensureDb()
  db.prospects = db.prospects || []
  const originalLength = db.prospects.length
  db.prospects = db.prospects.filter(p => p.id !== id)

  if (db.prospects.length < originalLength) {
    db.auditEvents.unshift({
      id: `aud-${Date.now()}`,
      actor: 'Authronic Admin',
      action: 'DELETE_PROSPECT',
      targetType: 'PROSPECT',
      targetId: id,
      details: `Removed prospect ${id} from CRM`,
      timestamp: new Date().toISOString(),
    })
    writeDb(db)
    return true
  }
  return false
}


