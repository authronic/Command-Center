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

const kpiTiles = [
  {
    label: 'Active Workflows',
    value: '0',
    note: 'n8n not connected',
    icon: Activity,
    color: 'var(--brand-orange)',
    href: '/runs',
    tag: 'Operational',
  },
  {
    label: 'Awaiting Approval',
    value: '2',
    note: 'Content drafts pending',
    icon: FileText,
    color: '#60A5FA',
    href: '/approvals',
    tag: 'Action needed',
  },
  {
    label: 'Qualified Prospects',
    value: '3',
    note: 'Doha & Dubai pipeline',
    icon: Users,
    color: '#34D399',
    href: '/sales',
    tag: 'GCC Focus',
  },
  {
    label: 'Failed Runs (24h)',
    value: '1',
    note: 'Requires diagnosis',
    icon: AlertTriangle,
    color: '#F87171',
    href: '/runs',
    tag: 'Check logs',
  },
]

const actionRequiredItems = [
  {
    id: 'act-1',
    type: 'Approval',
    title: 'Review: Qatar Real Estate AI Lead Gen — Post Draft',
    detail: 'Static post draft with verified research angle. Awaiting founder approval before scheduling.',
    urgency: 'high',
    actionLabel: 'Review post',
    href: '/approvals',
    time: '12m ago',
  },
  {
    id: 'act-2',
    type: 'Failed run',
    title: 'AUTH-C01 Research intake failed — invalid source format',
    detail: 'Gmail webhook payload could not parse topic #4 URL citation. Safe manual retry available.',
    urgency: 'high',
    actionLabel: 'Open run',
    href: '/runs',
    time: '45m ago',
  },
  {
    id: 'act-3',
    type: 'Follow-up due',
    title: 'Example Brokerage A (Dubai) — discovery call scheduled',
    detail: 'Verify pain hypothesis: unresponded weekend property inquiries. Brief ready.',
    urgency: 'normal',
    actionLabel: 'View prospect',
    href: '/sales',
    time: 'Today · 4:00 PM',
  },
]

const recentActivity = [
  {
    id: 'ev-1',
    agent: 'AUTH-C02 Research Engine',
    event: 'Analyzed 5 GCC real estate topics and prepared scoring matrix',
    time: '2 hours ago',
    status: 'success',
    href: '/content',
  },
  {
    id: 'ev-2',
    agent: 'AUTH-S01 CRM Lead Ingestion',
    event: 'Enriched 3 GCC brokerage prospects with public licensing data',
    time: '3 hours ago',
    status: 'success',
    href: '/sales',
  },
  {
    id: 'ev-3',
    agent: 'AUTH-C01 Research Intake',
    event: 'Failed parsing payload from research email (validation error)',
    time: '4 hours ago',
    status: 'failed',
    href: '/runs',
  },
  {
    id: 'ev-4',
    agent: 'System Security',
    event: 'Admin authenticated session established from verified IP',
    time: 'Today',
    status: 'info',
    href: '/settings',
  },
]

export default function DashboardPage() {
  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  })

  return (
    <div className="max-w-[1480px] mx-auto space-y-8">
      {/* Demo Environment Banner */}
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
            <span className="font-semibold mr-1.5">Demo Environment Active:</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Integrations are in sandbox mode. Database records and sample metrics are clearly labeled.
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
            AUTHRONIC / OPERATIONS
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
            href="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: 'var(--brand-orange)',
              color: '#101110',
            }}
          >
            <Plus size={16} />
            <span>Create task</span>
          </Link>
          <Link
            href="/runs"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-soft)',
              color: 'var(--text-primary)',
            }}
          >
            <Activity size={15} style={{ color: 'var(--text-muted)' }} />
            <span>View activity</span>
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

      {/* Action Required Lane (Highest Priority) */}
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
              style={{ background: 'rgba(247, 143, 30, 0.15)', color: 'var(--brand-orange)' }}
            >
              {actionRequiredItems.length} items
            </span>
          </div>
          <Link
            href="/approvals"
            className="text-xs font-medium hover:underline flex items-center gap-1"
            style={{ color: 'var(--brand-orange)' }}
          >
            Review all approvals <ArrowRight size={12} />
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
          {actionRequiredItems.map((item) => (
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
          ))}
        </div>
      </div>

      {/* Two Column Section: Content Pipeline + Sales Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Pipeline Preview */}
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
              { stage: 'Incoming Research Ideas', count: 5, active: true },
              { stage: 'Research Verified & Scored', count: 3, active: true },
              { stage: 'Drafting Copy & Briefs', count: 1, active: true },
              { stage: 'In Review & Approval', count: 2, active: true },
              { stage: 'Scheduled (Internal)', count: 0, active: false },
              { stage: 'Published (Verified)', count: 0, active: false },
            ].map(({ stage, count, active }) => (
              <div key={stage} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-none">
                <span className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {stage}
                </span>
                <span
                  className="text-xs sm:text-sm font-semibold tabular-nums px-2 py-0.5 rounded"
                  style={{
                    background: active && count > 0 ? 'rgba(247, 143, 30, 0.1)' : 'var(--surface-2)',
                    color: active && count > 0 ? 'var(--brand-orange)' : 'var(--text-muted)',
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Pipeline Preview */}
        <div
          className="p-5 sm:p-6 rounded-xl"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Sales Engine Pipeline
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Doha & Dubai real estate operations validation
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
              { stage: 'Researching Market Data', count: 3, active: true },
              { stage: 'Qualified Hypothesis', count: 2, active: true },
              { stage: 'Contact Approach Approved', count: 1, active: true },
              { stage: 'Warm Conversation Active', count: 1, active: true },
              { stage: 'Discovery Meeting Scheduled', count: 1, active: true },
              { stage: 'Proposal / Pilot Agreement', count: 0, active: false },
            ].map(({ stage, count, active }) => (
              <div key={stage} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-none">
                <span className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {stage}
                </span>
                <span
                  className="text-xs sm:text-sm font-semibold tabular-nums px-2 py-0.5 rounded"
                  style={{
                    background: active && count > 0 ? 'rgba(52, 211, 153, 0.1)' : 'var(--surface-2)',
                    color: active && count > 0 ? '#34D399' : 'var(--text-muted)',
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
          {recentActivity.map((act) => (
            <Link
              key={act.id}
              href={act.href}
              className="flex items-start justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
              style={{ background: 'var(--surface-2)' }}
            >
              <div className="flex items-start gap-3">
                {act.status === 'success' ? (
                  <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : act.status === 'failed' ? (
                  <ShieldAlert size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Activity size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {act.agent}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      · {act.time}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {act.event}
                  </p>
                </div>
              </div>
              <ExternalLink size={13} style={{ color: 'var(--text-muted)' }} className="flex-shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </div>

      {/* Integration Health & Spend Honesty Section */}
      <div
        className="p-5 sm:p-6 rounded-xl"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            System Integrations & API Health
          </h2>
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Enforcing Rule 7: Zero fabricated statuses
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'n8n Workflow Engine', status: 'Not connected' },
            { name: 'Gmail Research Ingestion', status: 'Not connected' },
            { name: 'Gemini Research API', status: 'Not connected' },
            { name: 'OpenRouter Model Gateway', status: 'Not connected' },
            { name: 'PostgreSQL Database', status: 'Local / Ready' },
            { name: 'Social Publishing Engine', status: 'Not connected' },
          ].map(({ name, status }) => (
            <div
              key={name}
              className="p-3 rounded-lg text-xs"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-soft)',
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {status.includes('Ready') ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <XCircle size={13} className="text-zinc-500" />
                )}
                <span className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {name}
                </span>
              </div>
              <p
                className="text-[11px] font-mono"
                style={{ color: status.includes('Ready') ? '#34D399' : 'var(--text-muted)' }}
              >
                {status}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-4 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2"
          style={{ borderTop: '1px solid var(--border-soft)', color: 'var(--text-muted)' }}
        >
          <span>
            n8n and external AI providers are in disconnected mode. You can plan tasks, review demo records, and execute local operations.
          </span>
          <Link
            href="/integrations"
            className="font-medium hover:underline inline-flex items-center gap-1 flex-shrink-0"
            style={{ color: 'var(--brand-orange)' }}
          >
            Configure credentials <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}
