'use client'

import Link from 'next/link'
import {
  BarChart2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="max-w-[1480px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <p
          className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          AUTHRONIC / MANAGEMENT
        </p>
        <h1
          className="text-2xl sm:text-3xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
        >
          Analytics & Costs
        </h1>
        <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          Transparent operational telemetry and API cost tracking. We show &quot;No data yet&quot; rather than synthetic vanity charts.
        </p>
      </div>

      {/* Spend Estimation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Estimated AI Model Spend (MTD)',
            value: '$0.00',
            note: 'Gemini / OpenRouter in Sandbox',
            icon: Cpu,
            color: 'var(--brand-orange)',
          },
          {
            label: 'Total Posts Formatted',
            value: '4',
            note: 'Drafted in Sandbox',
            icon: Layers,
            color: '#60A5FA',
          },
          {
            label: 'Verified Social Engagement',
            value: '0',
            note: 'Channel APIs disconnected',
            icon: TrendingUp,
            color: '#34D399',
          },
        ].map((tile, i) => (
          <div
            key={i}
            className="p-5 rounded-xl space-y-2"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {tile.label}
              </span>
              <tile.icon size={16} style={{ color: tile.color }} />
            </div>
            <div className="text-3xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {tile.value}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {tile.note}
            </p>
          </div>
        ))}
      </div>

      {/* Honest Empty State Banner (Rule 1.3 / 5.12) */}
      <div
        className="p-8 sm:p-12 rounded-xl text-center space-y-4"
        style={{
          background: 'var(--surface-1)',
          border: '1px dashed var(--border-strong)',
        }}
      >
        <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-zinc-800/60 text-zinc-400">
          <BarChart2 size={24} />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            No Public Social Analytics Connected
          </h2>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            Connect a supported analytics source or configure official LinkedIn/Buffer credentials to track reach, impressions, and engagement metrics honestly.
          </p>
        </div>
        <Link
          href="/integrations"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
          style={{ background: 'var(--brand-orange)', color: '#101110' }}
        >
          <span>Connect Analytics Provider</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
