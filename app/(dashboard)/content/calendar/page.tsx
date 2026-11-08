'use client'

import { useState, useEffect } from 'react'
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
  Plus,
  Loader2,
  X,
  Send,
} from 'lucide-react'
import { ScheduledPostRecord } from '@/lib/db/types'

export default function CalendarPage() {
  const [posts, setPosts] = useState<ScheduledPostRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'week' | 'month'>('week')
  const [showAddModal, setShowAddModal] = useState(false)

  // New post modal state
  const [newTitle, setNewTitle] = useState('')
  const [newFormat, setNewFormat] = useState<'Static Post' | 'Carousel' | 'Video'>('Static Post')
  const [newChannel, setNewChannel] = useState<'LinkedIn' | 'Instagram' | 'Twitter/X'>('LinkedIn')
  const [newDay, setNewDay] = useState<ScheduledPostRecord['dayOfWeek']>('Monday')
  const [newTime, setNewTime] = useState('11:00 AM PKT (10:00 AM AST)')
  const [submitting, setSubmitting] = useState(false)

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/content/calendar')
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
      }
    } catch (err) {
      console.error('Failed to load scheduled posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleAddPost(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/content/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          format: newFormat,
          channel: newChannel,
          scheduledTime: `${newDay} · ${newTime}`,
          dayOfWeek: newDay,
        }),
      })

      if (res.ok) {
        setShowAddModal(false)
        setNewTitle('')
        loadPosts()
      }
    } catch (err) {
      console.error('Failed to create scheduled post:', err)
    } finally {
      setSubmitting(false)
    }
  }

  async function updateStatus(id: string, nextStatus: ScheduledPostRecord['status']) {
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, status: nextStatus } : p)))
    try {
      await fetch('/api/content/calendar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      })
    } catch (err) {
      console.error('Failed to update post status:', err)
      loadPosts()
    }
  }

  const days: ScheduledPostRecord['dayOfWeek'][] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

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
            Schedule and track planned social distribution across Qatar (AST) and UAE (GST) audience timezones.
          </p>
        </div>

        {/* View toggle and Add button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--surface-1)] border border-[var(--border-soft)]">
            {(['week', 'month'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-3 py-1 rounded text-xs font-semibold capitalize transition-colors cursor-pointer"
                style={{
                  background: view === v ? 'var(--brand-orange)' : 'transparent',
                  color: view === v ? '#101110' : 'var(--text-secondary)',
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-orange)] text-[#101110] hover:opacity-90 cursor-pointer transition-all"
          >
            <Plus size={14} />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Honesty rule 5.10 */}
      <div
        className="p-4 rounded-xl flex items-center gap-3 text-xs"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
      >
        <Share2 size={16} style={{ color: 'var(--brand-orange)' }} className="flex-shrink-0" />
        <span style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Evidence Rule 5.10:</strong> Scheduled items are marked as{' '}
          <code className="text-zinc-300">scheduled_internal</code> until social API scheduler confirms queue acceptance.
        </span>
      </div>

      {/* Weekly Grid View */}
      {view === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {days.map(day => {
            const dayPosts = posts.filter(p => p.dayOfWeek === day)
            return (
              <div
                key={day}
                className="rounded-xl overflow-hidden flex flex-col min-h-[220px]"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
              >
                {/* Day Header */}
                <div
                  className="p-2.5 text-center text-xs font-semibold border-b"
                  style={{
                    borderColor: 'var(--border-soft)',
                    background: 'var(--surface-2)',
                    color: day === 'Monday' || day === 'Wednesday' || day === 'Friday'
                      ? 'var(--brand-orange)'
                      : 'var(--text-muted)',
                  }}
                >
                  {day}
                </div>

                {/* Day Posts */}
                <div className="p-2 space-y-2 flex-1">
                  {dayPosts.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-4 text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
                      No slots
                    </div>
                  ) : (
                    dayPosts.map(p => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-lg space-y-1.5 transition-transform hover:scale-[1.02]"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border-soft)' }}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span
                            className="px-1.5 py-0.5 rounded font-mono font-bold"
                            style={{ background: 'rgba(247, 143, 30, 0.15)', color: 'var(--brand-orange)' }}
                          >
                            {p.format}
                          </span>
                          <span className="font-mono text-zinc-400">{p.channel}</span>
                        </div>
                        <h4 className="text-xs font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                          {p.title}
                        </h4>
                        <div className="text-[10px] flex items-center gap-1 text-zinc-400 font-mono">
                          <Clock size={10} style={{ color: 'var(--brand-orange)' }} />
                          <span className="truncate">{p.scheduledTime.split('·')[1] || p.scheduledTime}</span>
                        </div>
                        <div className="pt-1 flex items-center justify-between">
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold"
                            style={{
                              background: p.status === 'published_verified' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              color: p.status === 'published_verified' ? '#4ade80' : '#60a5fa',
                            }}
                          >
                            {p.status === 'scheduled_internal' ? 'Scheduled' : p.status}
                          </span>
                          <button
                            onClick={() =>
                              updateStatus(
                                p.id,
                                p.status === 'scheduled_internal' ? 'published_verified' : 'scheduled_internal'
                              )
                            }
                            className="text-[10px] text-zinc-400 hover:text-white cursor-pointer underline"
                            title="Toggle status"
                          >
                            Toggle
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List / Month Summary View */
        <div className="space-y-3">
          {loading ? (
            <div className="p-12 text-center text-xs flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Loader2 size={16} className="animate-spin text-[var(--brand-orange)]" />
              <span>Loading calendar...</span>
            </div>
          ) : (
            posts.map(item => (
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

                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: item.status === 'published_verified' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: item.status === 'published_verified' ? '#4ade80' : '#60a5fa',
                    }}
                  >
                    <CheckCircle2 size={12} />
                    <span>{item.status === 'scheduled_internal' ? 'Scheduled Internally' : item.status}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Schedule Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
          >
            <div
              className="p-5 flex items-center justify-between border-b"
              style={{ borderColor: 'var(--border-soft)', background: 'var(--surface-2)' }}
            >
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Schedule Social Post
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-white/5 cursor-pointer text-zinc-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPost} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Post Title / Headline:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Doha Luxury Real Estate Lead SLA Breakdown"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Format:
                  </label>
                  <select
                    value={newFormat}
                    onChange={e => setNewFormat(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                  >
                    <option value="Static Post">Static Post</option>
                    <option value="Carousel">Carousel (7-Slides)</option>
                    <option value="Video">Video Script</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Channel:
                  </label>
                  <select
                    value={newChannel}
                    onChange={e => setNewChannel(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter/X">Twitter / X</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Day of Week:
                  </label>
                  <select
                    value={newDay}
                    onChange={e => setNewDay(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Target Time:
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200 font-mono"
                    placeholder="11:00 AM PKT (10:00 AM AST)"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border-soft)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 cursor-pointer text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-orange)] text-[#101110] hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>Schedule Slot</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
