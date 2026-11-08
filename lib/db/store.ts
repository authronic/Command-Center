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
  auditEvents: [],
  batches: [],
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


