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
