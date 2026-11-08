'use client'

import { useState } from 'react'
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

interface ApprovalItem {
  id: string
  title: string
  format: 'Static Post' | 'Carousel' | 'Video'
  market: 'Qatar (Doha)' | 'UAE (Dubai)'
  author: string
  version: string
  summary: string
  claims: string[]
  status: 'pending' | 'approved' | 'revision_requested' | 'rejected'
  submittedAt: string
}

const initialApprovals: ApprovalItem[] = [
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
]

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals)
  const [feedbackInput, setFeedbackInput] = useState<{ [key: string]: string }>({})
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null)

  function handleApprove(id: string) {
    setApprovals(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'approved' } : item))
    )
  }

  function handleRequestRevision(id: string) {
    const feedback = feedbackInput[id] || 'Requested adjustments to headline and citations.'
    setApprovals(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'revision_requested' } : item))
    )
    setActiveFeedbackId(null)
  }

  function handleReject(id: string) {
    setApprovals(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'rejected' } : item))
    )
  }

  const pendingCount = approvals.filter(a => a.status === 'pending').length

  return (
    <div className="max-w-[1480px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p
            className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            AUTHRONIC / OVERVIEW
          </p>
          <h1
            className="text-2xl sm:text-3xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
          >
            Approvals Queue
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            Central human-in-the-loop decision gate. No external post or cold outreach is published without authorization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-xs px-3 py-1.5 rounded-lg font-semibold"
            style={{
              background: pendingCount > 0 ? 'rgba(247, 143, 30, 0.15)' : 'var(--surface-2)',
              color: pendingCount > 0 ? 'var(--brand-orange)' : 'var(--text-muted)',
              border: '1px solid var(--border-soft)',
            }}
          >
            {pendingCount} Pending Decision
          </span>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {approvals.map(item => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-xl space-y-4 transition-all"
            style={{
              background: 'var(--surface-1)',
              border:
                item.status === 'approved'
                  ? '1px solid rgba(52, 211, 153, 0.3)'
                  : item.status === 'revision_requested'
                  ? '1px solid rgba(251, 191, 36, 0.3)'
                  : item.status === 'rejected'
                  ? '1px solid rgba(248, 113, 113, 0.3)'
                  : '1px solid var(--border-soft)',
            }}
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="px-2.5 py-0.5 rounded text-xs font-semibold"
                  style={{ background: 'var(--surface-2)', color: 'var(--brand-orange)' }}
                >
                  {item.format}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  {item.version}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  · {item.market}
                </span>
              </div>

              {/* Status Badge */}
              <div>
                {item.status === 'approved' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 size={13} /> Approved for Scheduling
                  </span>
                )}
                {item.status === 'revision_requested' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400">
                    <MessageSquare size={13} /> Revision Requested
                  </span>
                )}
                {item.status === 'rejected' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400">
                    <ThumbsDown size={13} /> Rejected / Skipped
                  </span>
                )}
                {item.status === 'pending' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-[var(--brand-orange)]">
                    <Clock size={13} /> Awaiting Your Review
                  </span>
                )}
              </div>
            </div>

            {/* Title & Summary */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </h2>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                {item.summary}
              </p>
            </div>

            {/* Claims Verification Box */}
            <div
              className="p-3.5 rounded-lg text-xs space-y-1.5"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-soft)' }}
            >
              <div className="font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                <Sparkles size={13} style={{ color: 'var(--brand-orange)' }} />
                Fact Checking & Verification Rationale:
              </div>
              {item.claims.map((claim, idx) => (
                <p key={idx} style={{ color: 'var(--text-muted)' }} className="flex items-start gap-2">
                  <span className="text-[var(--brand-orange)]">•</span>
                  <span>{claim}</span>
                </p>
              ))}
            </div>

            {/* Interactive Decision Actions */}
            {item.status === 'pending' && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleApprove(item.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                  style={{
                    background: 'var(--brand-orange)',
                    color: '#101110',
                  }}
                >
                  <ThumbsUp size={14} />
                  <span>Approve Publication</span>
                </button>

                <button
                  onClick={() => setActiveFeedbackId(activeFeedbackId === item.id ? null : item.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/5 cursor-pointer"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border-soft)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <MessageSquare size={14} />
                  <span>Request Changes</span>
                </button>

                <button
                  onClick={() => handleReject(item.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                  style={{
                    color: 'var(--text-muted)',
                  }}
                >
                  <ThumbsDown size={14} />
                  <span>Reject / Skip</span>
                </button>
              </div>
            )}

            {/* Revision Feedback Drawer / Input */}
            {activeFeedbackId === item.id && (
              <div className="p-3.5 rounded-lg space-y-2 mt-2" style={{ background: 'var(--surface-2)' }}>
                <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Provide Specific Revision Feedback:
                </label>
                <textarea
                  rows={2}
                  value={feedbackInput[item.id] || ''}
                  onChange={e =>
                    setFeedbackInput({ ...feedbackInput, [item.id]: e.target.value })
                  }
                  placeholder="Specify required changes for copy, angle, or slide layout..."
                  className="w-full p-2.5 rounded-lg text-xs outline-none"
                  style={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-soft)',
                    color: 'var(--text-primary)',
                  }}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveFeedbackId(null)}
                    className="px-3 py-1.5 rounded text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRequestRevision(item.id)}
                    className="px-3.5 py-1.5 rounded text-xs font-semibold"
                    style={{ background: 'var(--brand-orange)', color: '#101110' }}
                  >
                    Send Revision Request
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
