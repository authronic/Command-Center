import Link from 'next/link'
import {
  Activity,
  FileText,
  Users,
  AlertTriangle,
  ArrowRight,
  XCircle,
  Plus,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import {
  getTasks,
  getApprovals,
  getRuns,
  getProspects,
  getActiveBatch,
  getAuditEvents,
} from '@/lib/db/store'

export default function DashboardPage() {
  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  })

  // Read live operational data from persistent store
  const tasks = getTasks()
  const approvals = getApprovals()
  const runs = getRuns()
  const prospects = getProspects()
  const activeBatch = getActiveBatch()
  const auditEvents = getAuditEvents()

  const pendingApprovals = approvals.filter(a => a.status === 'pending')
  const failedRuns = runs.filter(r => r.status === 'failed')

  const kpiTiles = [
    {
      label: 'Active Workflows',
      value: `${runs.filter(r => r.status === 'running').length}`,
      note: runs.length === 0 ? 'No active runs' : `${runs.length} logged`,
      icon: Activity,
      color: 'var(--brand-orange)',
      href: '/runs',
      tag: 'Operational',
    },
    {
      label: 'Awaiting Approval',
      value: `${pendingApprovals.length}`,
      note: pendingApprovals.length === 0 ? 'Queue is clear' : `${pendingApprovals.length} drafts pending`,
      icon: FileText,
      color: '#60A5FA',
      href: '/approvals',
      tag: pendingApprovals.length > 0 ? 'Action needed' : 'Clear',
    },
    {
      label: 'Qualified Prospects',
      value: `${prospects.length}`,
      note: prospects.length === 0 ? 'CRM is empty' : `${prospects.length} in pipeline`,
      icon: Users,
      color: '#34D399',
      href: '/sales',
      tag: 'GCC Focus',
    },
    {
      label: 'Failed Runs (24h)',
      value: `${failedRuns.length}`,
      note: failedRuns.length === 0 ? 'Zero failures' : 'Requires diagnosis',
      icon: AlertTriangle,
      color: failedRuns.length === 0 ? '#34D399' : '#F87171',
      href: '/runs',
      tag: failedRuns.length === 0 ? 'Healthy' : 'Check logs',
    },
  ]

  // Construct action items from real pending approvals and failed runs
  const actionRequiredItems = [
    ...pendingApprovals.map(a => ({
      id: a.id,
      type: 'Approval',
      title: a.title,
      detail: `${a.format} · ${a.market}. Awaiting founder decision.`,
      urgency: 'high' as const,
      actionLabel: 'Review post',
      href: '/approvals',
      time: a.submittedAt,
    })),
    ...failedRuns.map(r => ({
      id: r.id,
      type: 'Failed run',
      title: `${r.workflowName} (${r.agentCode}) failed`,
      detail: r.errorSummary || 'Execution failed during automated run.',
      urgency: 'high' as const,
      actionLabel: 'Open run',
      href: '/runs',
      time: r.startedAt,
    })),
  ]

  return (
    <div className="max-w-[1480px] mx-auto space-y-8">
      {/* Clean Environment Banner */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm"
        style={{
          background: 'rgba(247, 143, 30, 0.08)',
          border: '1px solid rgba(247, 143, 30, 0.22)',
          color: 'var(--brand-orange)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <Sparkles size={16} className="flex-shrink-0" />
          <div>
            <span className="font-semibold mr-1.5">Fresh Operational Workspace:</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Dashboard database is empty and ready for your live content batch and incoming leads.
            </span>
          </div>
        </div>
        <Link
          href="/integrations"
          className="inline-flex items-center gap-1 font-semibold hover:underline text-xs flex-shrink-0"
        >
          Check Integrations <ArrowRight size={12} />
        </Link>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p
            className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            AUTHRONIC / OPERATIONS · PKT: {formattedDate}
          </p>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
          >
            Your operations, in one place.
          </h1>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Review today&apos;s work, clear approvals, and keep every workflow accountable across Content and Sales.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/content"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: 'var(--brand-orange)',
              color: '#101110',
            }}
          >
            <Plus size={16} />
            <span>Ingest Content</span>
          </Link>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-soft)',
              color: 'var(--text-primary)',
            }}
          >
            <span>My Tasks</span>
          </Link>
        </div>
      </div>

      {/* 4 Navigable KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiTiles.map((tile) => {
          const Icon = tile.icon
          return (
            <Link
              key={tile.label}
              href={tile.href}
              className="p-5 rounded-xl block transition-all hover:translate-y-[-1px] group focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border-soft)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="p-2 rounded-lg"
                  style={{ background: 'var(--surface-2)', color: tile.color }}
                >
                  <Icon size={18} />
                </span>
                <span
                  className="text-[11px] font-mono px-2 py-0.5 rounded"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
                >
                  {tile.tag}
                </span>
              </div>
              <div
                className="text-3xl font-semibold tabular-nums mb-1 tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {tile.value}
              </div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                {tile.label}
              </div>
              <div className="text-xs flex items-center justify-between" style={{ color: 'var(--text-muted)' }}>
                <span>{tile.note}</span>
                <ArrowRight
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--brand-orange)' }}
                />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Action Required Lane */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2
              className="text-base sm:text-lg font-semibold"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              Action Required
            </h2>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: actionRequiredItems.length > 0 ? 'rgba(247, 143, 30, 0.15)' : 'rgba(74, 222, 128, 0.12)',
                color: actionRequiredItems.length > 0 ? 'var(--brand-orange)' : '#4ade80',
              }}
            >
              {actionRequiredItems.length} items
            </span>
          </div>
          <Link
            href="/approvals"
            className="text-xs font-medium hover:underline flex items-center gap-1"
            style={{ color: 'var(--brand-orange)' }}
          >
            Review approvals <ArrowRight size={12} />
          </Link>
        </div>

        <div
          className="rounded-xl overflow-hidden divide-y shadow-sm"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-soft)',
            borderColor: 'var(--border-soft)',
          }}
        >
          {actionRequiredItems.length === 0 ? (
            <div className="p-8 text-center text-xs flex items-center justify-center gap-2.5" style={{ color: 'var(--text-muted)' }}>
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>All clear. No pending approvals or failed runs requiring attention.</span>
            </div>
          ) : (
            actionRequiredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 gap-3 hover:bg-white/[0.015] transition-colors"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <span
                    className="text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide uppercase flex-shrink-0 mt-0.5"
                    style={{
                      background:
                        item.urgency === 'high'
                          ? 'rgba(248, 113, 113, 0.12)'
                          : 'rgba(96, 165, 250, 0.12)',
                      color: item.urgency === 'high' ? '#F87171' : '#60A5FA',
                    }}
                  >
                    {item.type}
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                      {item.detail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 flex-shrink-0 pt-2 md:pt-0">
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    {item.time}
                  </span>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--brand-orange)]/15"
                    style={{
                      color: 'var(--brand-orange)',
                      border: '1px solid rgba(247, 143, 30, 0.25)',
                    }}
                  >
                    {item.actionLabel}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Two Column Section: Content Pipeline + Sales Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Pipeline */}
        <div
          className="p-5 sm:p-6 rounded-xl"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Content Engine Pipeline
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Daily target: 2 static · 1 carousel · 1 video · 1 skip
              </p>
            </div>
            <Link
              href="/content"
              className="text-xs font-medium hover:underline flex items-center gap-1"
              style={{ color: 'var(--brand-orange)' }}
            >
              Open Studio <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { stage: 'Ingested Research Topics', count: activeBatch?.topics?.length || 0 },
              { stage: 'Allocated Topics', count: activeBatch?.topics?.filter(t => t.assignedFormat !== 'skip').length || 0 },
              { stage: 'Awaiting Founder Approval', count: pendingApprovals.length },
              { stage: 'Approved for Publishing', count: approvals.filter(a => a.status === 'approved').length },
            ].map(({ stage, count }) => (
              <div key={stage} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-none">
                <span className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {stage}
                </span>
                <span
                  className="text-xs sm:text-sm font-semibold tabular-nums px-2 py-0.5 rounded"
                  style={{
                    background: count > 0 ? 'rgba(247, 143, 30, 0.1)' : 'var(--surface-2)',
                    color: count > 0 ? 'var(--brand-orange)' : 'var(--text-muted)',
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Pipeline */}
        <div
          className="p-5 sm:p-6 rounded-xl"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Sales CRM Pipeline
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                GCC real estate operations (Doha, Dubai, Riyadh)
              </p>
            </div>
            <Link
              href="/sales"
              className="text-xs font-medium hover:underline flex items-center gap-1"
              style={{ color: 'var(--brand-orange)' }}
            >
              Open CRM <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { stage: 'Researching Market Data', count: prospects.filter(p => p.stage === 'Researching').length },
              { stage: 'Qualified Hypothesis', count: prospects.filter(p => p.stage === 'Qualified').length },
              { stage: 'Discovery Meeting Scheduled', count: prospects.filter(p => p.stage === 'Discovery').length },
              { stage: 'Proposal Sent', count: prospects.filter(p => p.stage === 'Proposal').length },
            ].map(({ stage, count }) => (
              <div key={stage} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-none">
                <span className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {stage}
                </span>
                <span
                  className="text-xs sm:text-sm font-semibold tabular-nums px-2 py-0.5 rounded"
                  style={{
                    background: count > 0 ? 'rgba(52, 211, 153, 0.1)' : 'var(--surface-2)',
                    color: count > 0 ? '#34D399' : 'var(--text-muted)',
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div
        className="p-5 sm:p-6 rounded-xl"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Recent Operational Activity
          </h2>
          <Link
            href="/runs"
            className="text-xs font-medium hover:underline flex items-center gap-1"
            style={{ color: 'var(--brand-orange)' }}
          >
            All execution logs <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-3">
          {auditEvents.length === 0 ? (
            <div className="p-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              No audit events logged yet. System is clean and ready.
            </div>
          ) : (
            auditEvents.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between p-3 rounded-lg"
                style={{ background: 'var(--surface-2)' }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {act.actor}
                      </span>
                      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        · {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {act.details || act.action}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
