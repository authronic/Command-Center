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
  lastSyncedAt?: string
}


const initialSeed: DatabaseSchema = {
  tasks: [
    {
      id: 'task-001',
      title: 'Verify Qatar brokerages regulatory licensing requirements (Doha market)',
      priority: 'high',
      status: 'overdue',
      category: 'Sales',
      dueAt: 'Yesterday',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'task-002',
      title: 'Deploy HeyGen API render webhook & test callback signatures',
      priority: 'medium',
      status: 'blocked',
      category: 'Infrastructure',
      dueAt: 'Pending API Key',
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      updatedAt: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: 'task-003',
      title: 'Review static post drafts for Dubai Real Estate lead conversion',
      priority: 'high',
      status: 'in_progress',
      category: 'Content',
      dueAt: 'Today · 5:00 PM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-004',
      title: 'Scaffold Authronic Command Center shell, brand tokens & NextAuth session',
      priority: 'high',
      status: 'completed',
      category: 'Infrastructure',
      dueAt: 'Today',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  approvals: [
    {
      id: 'appr-001',
      title: 'Qatar Real Estate AI Lead Conversion: Why Doha Brokerages Lose 40% of Inbound Leads',
      format: 'Static Post',
      market: 'Qatar (Doha)',
      author: 'AUTH-C02 Research Engine',
      version: 'v1.1',
      summary:
        'Editorial static post emphasizing fast response SLAs for high-ticket property inquiries in West Bay & The Pearl.',
      claims: [
        'Independent Doha brokerages average 3.5 hour response times on property portals.',
        'Verified citations attached from Qatar Ministry of Justice real estate reports.',
      ],
      status: 'pending',
      submittedAt: 'Today · 12:45 PM',
    },
    {
      id: 'appr-002',
      title: 'Dubai Off-Plan Lead Triage: 7 Automated Workflows for Independent Agencies',
      format: 'Carousel',
      market: 'UAE (Dubai)',
      author: 'AUTH-C03 Content Draft',
      version: 'v1.0',
      summary:
        '7-slide multi-slide carousel contrasting manual WhatsApp response delays with automated qualification pipelines.',
      claims: [
        'Framework covers qualification, CRM sync, and automated calendar scheduling.',
        'Zero fabricated customer logos or unverifiable ROI statistics.',
      ],
      status: 'pending',
      submittedAt: 'Today · 11:20 AM',
    },
  ],
  runs: [
    {
      id: 'run-001',
      executionId: 'exec-849201',
      workflowName: 'WF-Research-Intake',
      agentCode: 'AUTH-C01',
      status: 'failed',
      startedAt: 'Today · 12:55 PM',
      duration: '2.4s',
      errorSummary: 'Citation validation failure: Topic #4 missing verifiable HTTPS source URL.',
      redactedPayload: JSON.stringify(
        {
          batchId: 'batch-20261108-01',
          sender: '[REDACTED_GMAIL_SENDER]',
          topicsFound: 5,
          validationErrors: [{ topicIndex: 3, error: 'Missing source domain' }],
        },
        null,
        2
      ),
    },
    {
      id: 'run-002',
      executionId: 'exec-849188',
      workflowName: 'WF-Research-Scoring',
      agentCode: 'AUTH-C02',
      status: 'succeeded',
      startedAt: 'Today · 11:30 AM',
      duration: '4.8s',
      redactedPayload: JSON.stringify(
        {
          batchId: 'batch-20261108-01',
          topicsScored: 5,
          allocation: { static: 2, carousel: 1, video: 1, skip: 1 },
        },
        null,
        2
      ),
    },
    {
      id: 'run-003',
      executionId: 'exec-849052',
      workflowName: 'WF-Content-Drafting',
      agentCode: 'AUTH-C03',
      status: 'unknown',
      startedAt: 'Today · 10:15 AM',
      duration: '12.1s',
      errorSummary: 'Asset render response timed out. Reconciling with media storage.',
      redactedPayload: JSON.stringify(
        {
          jobId: 'render-c3-882',
          slideCount: 7,
          provider: 'local-renderer',
          status: 'awaiting_webhook',
        },
        null,
        2
      ),
    },
  ],
  auditEvents: [
    {
      id: 'aud-001',
      actor: 'Authronic Admin',
      action: 'INITIALIZE_SYSTEM',
      targetType: 'SYSTEM',
      targetId: 'sys-0',
      details: 'Command Center Phase 2 & 3 operational storage initialized.',
      timestamp: new Date().toISOString(),
    },
  ],
  batches: [
    {
      id: 'batch-20261108-01',
      name: 'GCC Real Estate AI Intake · Nov 8',
      createdAt: '2026-11-08T10:00:00.000Z',
      status: 'active',
      topics: [
        {
          id: 'top-1',
          batchId: 'batch-20261108-01',
          title: 'Qatar Real Estate Portals Lead Leakage: Why 40% of Inbound Buyers Receive No Callback within 2 Hours',
          sourceUrl: 'https://example.com/qatar-property-trends-2026',
          relevanceScore: 4.8,
          assignedFormat: 'static',
          targetAngle: 'Speed-to-lead SLA breakdown for Doha independent agencies',
          market: 'Qatar',
          status: 'allocated',
          staticCopy: {
            hook: '40% of inbound luxury property leads in Doha go completely cold before a human broker replies.',
            body: 'High-net-worth buyers in West Bay & The Pearl expect response times under 5 minutes. When brokerages take 3+ hours, 82% of prospects submit inquiries on competitor listings. An automated AI triage layer guarantees instant WhatsApp replies and pre-qualifies budgets before passing to senior agents.',
            cta: 'Read the full Doha speed-to-lead benchmark on our website: authronic.com',
            hashtags: ['#QatarRealEstate', '#DohaProperty', '#PropTech', '#AuthronicAI'],
          },
        },
        {
          id: 'top-2',
          batchId: 'batch-20261108-01',
          title: 'Off-Plan WhatsApp Automation: How Top Dubai Agencies Handle 200+ Daily Portal Leads',
          sourceUrl: 'https://example.com/dubai-offplan-inquiries',
          relevanceScore: 4.6,
          assignedFormat: 'carousel',
          targetAngle: '7-slide workflow comparison: manual vs automated qualification',
          market: 'UAE',
          status: 'allocated',
          slides: [
            {
              slideNumber: 1,
              headline: 'How Top Dubai Brokerages Triage 200+ Off-Plan Leads Daily',
              bodyText: 'Without hiring 10 extra junior admins.',
              visualNote: 'Cover Slide · High contrast orange gradient background',
            },
            {
              slideNumber: 2,
              headline: 'The Problem: Portal Notification Overload',
              bodyText: 'Inquiries arrive simultaneously from Property Finder, Bayut, and Instagram Ads. Manual WhatsApp replies take an average of 42 minutes.',
              visualNote: 'Split graphic showing notifications stacking up',
            },
            {
              slideNumber: 3,
              headline: 'Step 1: 30-Second Webhook Handshake',
              bodyText: 'The lead hits the portal → Instant n8n trigger captures name, phone number, and listing unit ID within 300ms.',
              visualNote: 'Technical architecture diagram icon',
            },
            {
              slideNumber: 4,
              headline: 'Step 2: Bilingual Qualification Agent',
              bodyText: 'An AI conversational agent reaches out via WhatsApp in English or Arabic, confirming investment budget, residency status, and financing.',
              visualNote: 'Bilingual chat mock-up window',
            },
            {
              slideNumber: 5,
              headline: 'Step 3: Instant CRM Sync & Calendar Invite',
              bodyText: 'High-intent leads are routed straight to the designated luxury agent’s Google Calendar with a briefing card.',
              visualNote: 'Calendar booking confirmation screen',
            },
            {
              slideNumber: 6,
              headline: 'The Result: 4.8x Higher Meeting Book Rate',
              bodyText: 'Agencies using instant conversational triage see 89% response rates compared to 31% on manual follow-ups.',
              visualNote: 'Metric comparison bar chart',
            },
            {
              slideNumber: 7,
              headline: 'Automate Your Inbound Flow with Authronic',
              bodyText: 'We build enterprise agentic pipelines for ambitious GCC real estate brokerages. Visit authronic.com to see live demos.',
              visualNote: 'Call-to-Action slide with official wordmark',
            },
          ],
        },
        {
          id: 'top-3',
          batchId: 'batch-20261108-01',
          title: 'AI Video Triage for Luxury GCC Listings: Enhancing High-Net-Worth Buyer Engagement',
          sourceUrl: 'https://example.com/gcc-luxury-tech',
          relevanceScore: 4.2,
          assignedFormat: 'video',
          targetAngle: 'Avatar video demonstration explaining 24/7 VIP buyer intake',
          market: 'GCC-General',
          status: 'allocated',
          scenes: [
            {
              sceneNumber: 1,
              timestampRange: '0:00 - 0:12',
              speakerText: 'If you sell 10-million-dollar penthouses in Dubai or villas in Doha, your biggest enemy isn’t the market. It’s the 4-hour delay before your first callback.',
              visualAction: 'Hook · Close-up avatar facing camera with luxury penthouse backdrop',
            },
            {
              sceneNumber: 2,
              timestampRange: '0:12 - 0:38',
              speakerText: 'High-net-worth international investors inquiry at 2 AM their local time. While your team is asleep, an AI VIP Concierge responds instantly in French, Arabic, or English, presenting unit floorplans and booking a private walkthrough.',
              visualAction: 'Core Insight · Animated smartphone UI showing instant VIP concierge response',
            },
            {
              sceneNumber: 3,
              timestampRange: '0:38 - 0:58',
              speakerText: 'Authronic builds bespoke AI concierge pipelines for GCC luxury developments. Click the link below to watch a live interactive walkthrough.',
              visualAction: 'Call to Action · Branded Authronic end card with QR code',
            },
          ],
        },
        {
          id: 'top-4',
          batchId: 'batch-20261108-01',
          title: 'Automated CRM Sync: Preventing Portal Inquiry Drops Between PropertyFinder & Local CRM',
          sourceUrl: 'https://example.com/crm-sync-realestate',
          relevanceScore: 4.5,
          assignedFormat: 'static',
          targetAngle: 'Practical technical checklist for agency operations leads',
          market: 'UAE',
          status: 'allocated',
          staticCopy: {
            hook: 'Why 1 out of 5 portal inquiries never make it into your agency’s CRM system.',
            body: 'Manual CSV exports and broken Zapier connections are leaking high-value leads every single weekend. Here is the 4-point architecture audit we use to ensure zero dropped leads across GCC property portals.',
            cta: 'Save this post for your operations meeting on Monday.',
            hashtags: ['#PropTechGCC', '#RealEstateTech', '#DubaiBrokers'],
          },
        },
        {
          id: 'top-5',
          batchId: 'batch-20261108-01',
          title: 'Generic US Real Estate Agent Marketing Strategies (Not Localized to GCC)',
          sourceUrl: 'https://example.com/us-generic-marketing',
          relevanceScore: 1.8,
          assignedFormat: 'skip',
          targetAngle: 'Out of regional scope; archived from batch',
          market: 'GCC-General',
          status: 'skipped',
        },
      ],
    },
  ],
  scheduledPosts: [
    {
      id: 'sch-1',
      title: 'Qatar Real Estate Portal SLA Breakdown',
      format: 'Static Post',
      channel: 'LinkedIn',
      scheduledTime: 'Mon Nov 10 · 11:00 AM PKT (10:00 AM AST)',
      dayOfWeek: 'Monday',
      status: 'scheduled_internal',
    },
    {
      id: 'sch-2',
      title: 'Dubai Off-Plan WhatsApp Lead Triage Flow (7-Slide Carousel)',
      format: 'Carousel',
      channel: 'LinkedIn',
      scheduledTime: 'Wed Nov 12 · 3:00 PM PKT (2:00 PM GST)',
      dayOfWeek: 'Wednesday',
      status: 'scheduled_internal',
    },
    {
      id: 'sch-3',
      title: 'VIP Buyer AI Video Concierge: 24/7 GCC Triage',
      format: 'Video',
      channel: 'LinkedIn',
      scheduledTime: 'Fri Nov 14 · 12:00 PM PKT (11:00 AM AST)',
      dayOfWeek: 'Friday',
      status: 'draft',
    },
  ],
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

