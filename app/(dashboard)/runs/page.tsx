'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  Code2,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { WorkflowRunRecord } from '@/lib/db/types'

export default function RunsPage() {
  const [runs, setRuns] = useState<WorkflowRunRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRun, setSelectedRun] = useState<WorkflowRunRecord | null>(null)
  const [filter, setFilter] = useState<'all' | 'failed' | 'succeeded'>('all')
  const [retryingId, setRetryingId] = useState<string | null>(null)

  async function loadRuns() {
    try {
      const res = await fetch('/api/runs')
      if (res.ok) {
        const data = await res.json()
        setRuns(data.runs || [])
      }
    } catch (err) {
      console.error('Failed to load runs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRuns()
  }, [])

  async function handleRetry(id: string) {
    setRetryingId(id)
    try {
      const res = await fetch(`/api/runs/${id}/retry`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setRuns(prev => prev.map(r => (r.id === id ? data.run : r)))
        if (selectedRun?.id === id) setSelectedRun(data.run)
      }
    } catch (err) {
      console.error('Failed to retry run:', err)
    } finally {
      setRetryingId(null)
    }
  }

  const filteredRuns = runs.filter(r => {
    if (filter === 'failed') return r.status === 'failed'
    if (filter === 'succeeded') return r.status === 'succeeded'
    return true
  })

  return (
    <div className="max-w-[1480px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p
            className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            AUTHRONIC / OPERATIONS
          </p>
          <h1
            className="text-2xl sm:text-3xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
          >
            Workflow Runs & Logs
          </h1>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Execution logs, failure diagnostics, and safe idempotency retries. Backed by persistent run store.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadRuns}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            style={{ border: '1px solid var(--border-soft)', color: 'var(--text-secondary)' }}
            title="Refresh run history"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
          {(['all', 'failed', 'succeeded'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer"
              style={{
                background: filter === tab ? 'rgba(247, 143, 30, 0.12)' : 'var(--surface-1)',
                color: filter === tab ? 'var(--brand-orange)' : 'var(--text-secondary)',
                border: filter === tab ? '1px solid var(--brand-orange)' : '1px solid var(--border-soft)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Runs Table */}
      <div
        className="rounded-xl overflow-hidden shadow-sm"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-soft)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border-soft)' }}>
                <th className="p-3.5 sm:p-4 font-semibold" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="p-3.5 sm:p-4 font-semibold" style={{ color: 'var(--text-muted)' }}>Workflow / Agent</th>
                <th className="p-3.5 sm:p-4 font-semibold hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Execution ID</th>
                <th className="p-3.5 sm:p-4 font-semibold hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>Started</th>
                <th className="p-3.5 sm:p-4 font-semibold" style={{ color: 'var(--text-muted)' }}>Duration</th>
                <th className="p-3.5 sm:p-4 font-semibold text-right" style={{ color: 'var(--text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-[var(--brand-orange)]" />
                      <span>Loading runs...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                    No workflow runs found.
                  </td>
                </tr>
              ) : (
                filteredRuns.map(run => (
                  <tr
                    key={run.id}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => setSelectedRun(run)}
                  >
                    <td className="p-3.5 sm:p-4">
                      {run.status === 'succeeded' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400">
                          <CheckCircle2 size={12} /> Success
                        </span>
                      ) : run.status === 'failed' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400">
                          <XCircle size={12} /> Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400">
                          <AlertTriangle size={12} /> Unknown
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 sm:p-4 font-medium" style={{ color: 'var(--text-primary)' }}>
                      <div>
                        <span className="font-semibold">{run.workflowName}</span>
                        <span className="text-[11px] font-mono ml-2" style={{ color: 'var(--brand-orange)' }}>
                          {run.agentCode}
                        </span>
                      </div>
                      {run.errorSummary && (
                        <p className="text-[11px] mt-0.5 text-red-400 truncate max-w-sm">
                          {run.errorSummary}
                        </p>
                      )}
                    </td>
                    <td className="p-3.5 sm:p-4 font-mono text-[11px] hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>
                      {run.executionId}
                    </td>
                    <td className="p-3.5 sm:p-4 text-[11px] hidden sm:table-cell" style={{ color: 'var(--text-secondary)' }}>
                      {run.startedAt}
                    </td>
                    <td className="p-3.5 sm:p-4 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {run.duration}
                    </td>
                    <td className="p-3.5 sm:p-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-2">
                        {run.status === 'failed' && (
                          <button
                            onClick={() => handleRetry(run.id)}
                            disabled={retryingId === run.id}
                            className="px-2.5 py-1 rounded text-[11px] font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer inline-flex items-center gap-1"
                            style={{ background: 'var(--brand-orange)', color: '#101110' }}
                          >
                            <RotateCw size={11} className={retryingId === run.id ? 'animate-spin' : ''} />
                            <span>Retry</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedRun(run)}
                          className="p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                          style={{ color: 'var(--text-muted)' }}
                          title="Inspect payload"
                          aria-label="Inspect payload"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Redacted Payload Drawer / Modal */}
      {selectedRun && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Execution details"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(3px)' }}
          onClick={() => setSelectedRun(null)}
        >
          <div
            className="w-full max-w-xl rounded-xl p-5 sm:p-6 space-y-4 shadow-2xl"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-strong)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-soft)' }}>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Execution {selectedRun.executionId}
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {selectedRun.workflowName} · {selectedRun.agentCode}
                </p>
              </div>
              <button
                onClick={() => setSelectedRun(null)}
                className="text-xs px-2 py-1 rounded hover:bg-white/5 cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                Close
              </button>
            </div>

            {selectedRun.errorSummary && (
              <div className="p-3 rounded-lg text-xs bg-red-500/10 border border-red-500/25 text-red-400">
                <span className="font-semibold">Error Diagnostics:</span> {selectedRun.errorSummary}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5">
                  <Code2 size={13} style={{ color: 'var(--brand-orange)' }} />
                  Redacted Payload (Rule 8 Privacy Enforced)
                </span>
                <span className="text-[10px] font-mono text-zinc-500">JSON</span>
              </div>
              <pre
                className="p-3.5 rounded-lg text-xs font-mono overflow-x-auto max-h-60"
                style={{ background: 'var(--surface-2)', color: 'var(--text-primary)' }}
              >
                {selectedRun.redactedPayload}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Duration: {selectedRun.duration}
              </span>
              {selectedRun.status === 'failed' && (
                <button
                  onClick={() => handleRetry(selectedRun.id)}
                  disabled={retryingId === selectedRun.id}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  style={{ background: 'var(--brand-orange)', color: '#101110' }}
                >
                  {retryingId === selectedRun.id ? 'Retrying...' : 'Safe Idempotent Retry'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
