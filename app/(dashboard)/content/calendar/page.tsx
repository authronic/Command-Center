'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Share2,
} from 'lucide-react'

interface ScheduledPost {
  id: string
  title: string
  format: 'Static Post' | 'Carousel' | 'Video'
  channel: 'LinkedIn' | 'Instagram'
  scheduledTime: string
  status: 'scheduled_internal' | 'published_verified' | 'failed'
}

const scheduleItems: ScheduledPost[] = [
  {
    id: 'sch-1',
    title: 'Qatar Real Estate Portal SLA Breakdown',
    format: 'Static Post',
    channel: 'LinkedIn',
    scheduledTime: 'Mon Nov 10 · 11:00 AM PKT (10:00 AM AST)',
    status: 'scheduled_internal',
  },
  {
    id: 'sch-2',
    title: 'Dubai Off-Plan WhatsApp Lead Triage Flow',
    format: 'Carousel',
    channel: 'Instagram',
    scheduledTime: 'Tue Nov 11 · 3:00 PM PKT (2:00 PM GST)',
    status: 'scheduled_internal',
  },
]

export default function CalendarPage() {
  const [view, setView] = useState<'week' | 'month'>('week')

  return (
    <div className="max-w-[1480px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/content"
              className="text-xs flex items-center gap-1 hover:underline"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft size={12} /> Back to Content Studio
            </Link>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
          >
            Content Calendar
          </h1>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Schedule and track planned social distribution across Qatar and UAE audience timezones.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2">
          {(['week', 'month'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer"
              style={{
                background: view === v ? 'rgba(247, 143, 30, 0.12)' : 'var(--surface-1)',
                color: view === v ? 'var(--brand-orange)' : 'var(--text-secondary)',
                border: view === v ? '1px solid var(--brand-orange)' : '1px solid var(--border-soft)',
              }}
            >
              {v} View
            </button>
          ))}
        </div>
      </div>

      {/* Honesty note on publishing status */}
      <div
        className="p-4 rounded-xl flex items-center gap-3 text-xs"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
      >
        <Share2 size={16} style={{ color: 'var(--brand-orange)' }} className="flex-shrink-0" />
        <span style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Evidence Rule 5.10:</strong> Scheduled items are marked as{' '}
          <code className="text-zinc-300">scheduled internally</code> until social API scheduler confirms queue acceptance.
        </span>
      </div>

      {/* Scheduled items list */}
      <div className="space-y-3">
        {scheduleItems.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-[11px] font-semibold"
                  style={{ background: 'var(--surface-2)', color: 'var(--brand-orange)' }}
                >
                  {item.format}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  {item.channel}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </h2>
              <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Clock size={12} style={{ color: 'var(--brand-orange)' }} />
                <span>{item.scheduledTime}</span>
              </p>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400">
                <CheckCircle2 size={12} /> Scheduled Internally
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
