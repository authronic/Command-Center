import fs from 'fs'
import path from 'path'
import {
  TaskRecord,
  ApprovalRecord,
  WorkflowRunRecord,
  AuditEventRecord,
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
      details: 'Command Center Phase 2 operational storage initialized.',
      timestamp: new Date().toISOString(),
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
