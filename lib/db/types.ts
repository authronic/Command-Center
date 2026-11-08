export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'overdue'
export type TaskCategory = 'Content' | 'Sales' | 'Infrastructure'

export interface TaskRecord {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  category: TaskCategory
  dueAt: string
  ownerId?: string
  createdAt: string
  updatedAt: string
  syncedToSheet?: boolean
}

export type ApprovalFormat = 'Static Post' | 'Carousel' | 'Video' | 'Proposal'
export type ApprovalStatus = 'pending' | 'approved' | 'revision_requested' | 'rejected'

export interface ApprovalRecord {
  id: string
  title: string
  format: ApprovalFormat
  market: string
  author: string
  version: string
  summary: string
  claims: string[]
  status: ApprovalStatus
  feedback?: string
  reviewer?: string
  decidedAt?: string
  submittedAt: string
}

export interface WorkflowRunRecord {
  id: string
  executionId: string
  workflowName: string
  agentCode: string
  status: 'succeeded' | 'failed' | 'running' | 'unknown'
  startedAt: string
  duration: string
  errorSummary?: string
  redactedPayload: string
}

export interface AuditEventRecord {
  id: string
  actor: string
  action: string
  targetType: string
  targetId: string
  details?: string
  timestamp: string
}

export interface AssetRecord {
  id: string
  name: string
  type: 'image' | 'video' | 'pdf' | 'json' | 'doc'
  size: string
  driveFileId?: string
  driveFolderId?: string
  webViewLink?: string
  thumbnailLink?: string
  relatedBatch?: string
  uploadedAt: string
}

export interface SalesLeadRecord {
  id: string
  company: string
  contactName: string
  contactTitle?: string
  city: 'Dubai' | 'Doha' | 'Riyadh' | 'Other'
  country: 'UAE' | 'Qatar' | 'Saudi Arabia' | 'GCC'
  businessType: string
  stage: 'Researching' | 'Qualified' | 'Contact Approved' | 'Discovery' | 'Proposal' | 'Won' | 'Lost'
  dealSize: string
  fitScore: number
  painHypothesis: string
  nextAction: string
  lastTouch: string
  createdAt?: string
  updatedAt?: string
}


export type TopicFormat = 'static' | 'carousel' | 'video' | 'skip'

export interface CarouselSlide {
  slideNumber: number
  headline: string
  bodyText: string
  visualNote: string
}

export interface VideoScene {
  sceneNumber: number
  timestampRange: string
  speakerText: string
  visualAction: string
}

export interface ResearchTopicRecord {
  id: string
  batchId: string
  title: string
  sourceUrl: string
  relevanceScore: number
  assignedFormat: TopicFormat
  targetAngle: string
  market: 'Qatar' | 'UAE' | 'KSA' | 'GCC-General'
  status: 'researched' | 'allocated' | 'drafted' | 'skipped'
  slides?: CarouselSlide[]
  scenes?: VideoScene[]
  staticCopy?: {
    hook: string
    body: string
    cta: string
    hashtags: string[]
  }
}

export interface ContentBatchRecord {
  id: string
  name: string
  createdAt: string
  status: 'active' | 'archived'
  topics: ResearchTopicRecord[]
}

export interface ScheduledPostRecord {
  id: string
  topicId?: string
  title: string
  format: 'Static Post' | 'Carousel' | 'Video'
  channel: 'LinkedIn' | 'Instagram' | 'Twitter/X'
  scheduledTime: string
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  status: 'draft' | 'scheduled_internal' | 'published_verified' | 'failed'
}


