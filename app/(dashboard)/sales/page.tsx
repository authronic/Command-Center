'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Plus,
  Building2,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield,
  Tag,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  Briefcase,
} from 'lucide-react'
import { SalesLeadRecord } from '@/lib/db/types'

const STAGES: SalesLeadRecord['stage'][] = [
  'Researching',
  'Qualified',
  'Contact Approved',
  'Discovery',
  'Proposal',
  'Won',
]

export default function SalesPage() {
  const [prospects, setProspects] = useState<SalesLeadRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState<'all' | 'Doha' | 'Dubai' | 'Riyadh'>('all')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  // New Prospect state
  const [newCompany, setNewCompany] = useState('')
  const [newContact, setNewContact] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newCity, setNewCity] = useState<'Dubai' | 'Doha' | 'Riyadh'>('Doha')
  const [newBusinessType, setNewBusinessType] = useState('Independent Luxury Real Estate Agency')
  const [newDealSize, setNewDealSize] = useState('$7,500/mo')
  const [newFitScore, setNewFitScore] = useState(4.6)
  const [newHypothesis, setNewHypothesis] = useState('')
  const [newNextAction, setNewNextAction] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function loadProspects() {
    setLoading(true)
    try {
      const res = await fetch('/api/sales/prospects')
      if (res.ok) {
        const data = await res.json()
        setProspects(data.prospects || [])
      }
    } catch (err) {
      console.error('Failed to load prospects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProspects()
  }, [])

  async function handleAddProspect(e: React.FormEvent) {
    e.preventDefault()
    if (!newCompany.trim() || !newHypothesis.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/sales/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: newCompany.trim(),
          contactName: newContact.trim() || 'Principal Broker',
          contactTitle: newTitle.trim() || 'Managing Director',
          city: newCity,
          country: newCity === 'Doha' ? 'Qatar' : newCity === 'Riyadh' ? 'Saudi Arabia' : 'UAE',
          businessType: newBusinessType,
          stage: 'Researching',
          dealSize: newDealSize,
          fitScore: Number(newFitScore),
          painHypothesis: newHypothesis.trim(),
          nextAction: newNextAction.trim() || 'Review property portal listings and speed-to-lead benchmark',
          lastTouch: 'Today · Manual intake',
        }),
      })

      if (res.ok) {
        setShowAddModal(false)
        setNewCompany('')
        setNewContact('')
        setNewTitle('')
        setNewHypothesis('')
        setNewNextAction('')
        loadProspects()
      }
    } catch (err) {
      console.error('Failed to create prospect:', err)
    } finally {
      setSubmitting(false)
    }
  }

  async function advanceStage(id: string, currentStage: SalesLeadRecord['stage']) {
    const currentIndex = STAGES.indexOf(currentStage)
    if (currentIndex >= STAGES.length - 1) return
    const nextStage = STAGES[currentIndex + 1]

    // Optimistic UI update
    setProspects(prev => prev.map(p => (p.id === id ? { ...p, stage: nextStage } : p)))

    try {
      await fetch(`/api/sales/prospects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: nextStage }),
      })
    } catch (err) {
      console.error('Failed to update stage:', err)
      loadProspects()
    }
  }

  async function deleteLead(id: string) {
    setProspects(prev => prev.filter(p => p.id !== id))
    try {
      await fetch(`/api/sales/prospects/${id}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to delete prospect:', err)
      loadProspects()
    }
  }

  const filtered = prospects.filter(p => {
    const matchesSearch =
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.contactName.toLowerCase().includes(search.toLowerCase()) ||
      p.businessType.toLowerCase().includes(search.toLowerCase())
    const matchesCity = cityFilter === 'all' || p.city === cityFilter
    const matchesStage = stageFilter === 'all' || p.stage === stageFilter
    return matchesSearch && matchesCity && matchesStage
  })

  // Calculate high-level pipeline stats
  const dohaCount = prospects.filter(p => p.city === 'Doha').length
  const dubaiCount = prospects.filter(p => p.city === 'Dubai').length
  const riyadhCount = prospects.filter(p => p.city === 'Riyadh').length

  return (
    <div className="max-w-[1480px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p
            className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            AUTHRONIC / CRM · PHASE 4
          </p>
          <h1
            className="text-2xl sm:text-3xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
          >
            Sales CRM — GCC Market Pipeline
          </h1>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Real estate agency automation pipeline across Doha (Qatar), Dubai (UAE), and Riyadh (KSA). Human authorization required before outbound outreach.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-orange)] text-[#101110] hover:opacity-90 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add Prospect</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-xl space-y-1"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            Active Pipeline Prospects
          </span>
          <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
            {prospects.length}
          </div>
          <p className="text-[11px] text-zinc-400">Validated high-intent brokerages</p>
        </div>

        <div
          className="p-4 rounded-xl space-y-1"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            Estimated Pipeline ARR
          </span>
          <div className="text-2xl font-bold font-mono text-[var(--brand-orange)]">
            $464,400
          </div>
          <p className="text-[11px] text-zinc-400">Based on $7.7k/mo average SLA</p>
        </div>

        <div
          className="p-4 rounded-xl space-y-1"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            GCC Market Distribution
          </span>
          <div className="text-sm font-semibold font-mono flex items-center gap-2 mt-1" style={{ color: 'var(--text-primary)' }}>
            <span>{dohaCount} Doha</span> · <span>{dubaiCount} Dubai</span> · <span>{riyadhCount} Riyadh</span>
          </div>
          <p className="text-[11px] text-emerald-400">100% GCC localized scope</p>
        </div>

        <div
          className="p-4 rounded-xl space-y-1"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            Average Hypothesis Fit Score
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            4.5 / 5.0
          </div>
          <p className="text-[11px] text-zinc-400">Speed-to-lead & WhatsApp triage</p>
        </div>
      </div>

      {/* Search & Market Filter Bar */}
      <div
        className="p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search companies by name, city, or contact..."
            className="bg-transparent text-xs sm:text-sm outline-none flex-1 text-[var(--text-primary)]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* City filter */}
          <div className="flex items-center gap-1">
            {(['all', 'Doha', 'Dubai', 'Riyadh'] as const).map(c => (
              <button
                key={c}
                onClick={() => setCityFilter(c)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                style={{
                  background: cityFilter === c ? 'rgba(247, 143, 30, 0.15)' : 'var(--surface-2)',
                  color: cityFilter === c ? 'var(--brand-orange)' : 'var(--text-secondary)',
                  border: cityFilter === c ? '1px solid var(--brand-orange)' : '1px solid var(--border-soft)',
                }}
              >
                {c === 'all' ? 'All Markets' : c}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Stage filter */}
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
          >
            <option value="all">All Stages</option>
            {STAGES.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prospects List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-16 text-center text-xs flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Loader2 size={16} className="animate-spin text-[var(--brand-orange)]" />
            <span>Loading CRM pipeline...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs rounded-xl" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)', color: 'var(--text-muted)' }}>
            No prospects match your search criteria.
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-xl space-y-4 transition-colors"
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border-soft)',
              }}
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className="p-2.5 rounded-lg mt-0.5"
                    style={{ background: 'var(--surface-2)', color: 'var(--brand-orange)' }}
                  >
                    <Building2 size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {item.company}
                      </h2>
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                        <MapPin size={11} />
                        {item.city}, {item.country}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        {item.dealSize}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Contact: <strong className="text-zinc-200">{item.contactName}</strong> {item.contactTitle && `(${item.contactTitle})`} · {item.businessType}
                    </p>
                  </div>
                </div>

                {/* Stage badge and Advance button */}
                <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{
                      background:
                        item.stage === 'Won'
                          ? 'rgba(74, 222, 128, 0.15)'
                          : item.stage === 'Proposal' || item.stage === 'Discovery'
                          ? 'rgba(247, 143, 30, 0.15)'
                          : 'rgba(59, 130, 246, 0.15)',
                      color:
                        item.stage === 'Won'
                          ? '#4ade80'
                          : item.stage === 'Proposal' || item.stage === 'Discovery'
                          ? 'var(--brand-orange)'
                          : '#60a5fa',
                    }}
                  >
                    {item.stage}
                  </span>

                  {item.stage !== 'Won' && (
                    <button
                      onClick={() => advanceStage(item.id, item.stage)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer"
                      style={{ border: '1px solid var(--border-soft)', color: 'var(--brand-orange)' }}
                      title="Advance to next sales stage"
                    >
                      <span>Advance</span>
                      <ChevronRight size={12} />
                    </button>
                  )}

                  <button
                    onClick={() => deleteLead(item.id)}
                    className="p-1 rounded text-zinc-500 hover:text-red-400 cursor-pointer transition-colors"
                    title="Delete prospect"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Pain Hypothesis (Rule 6.3: Strictly labeled hypothesis) */}
              <div
                className="p-3.5 rounded-lg text-xs space-y-1"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-soft)' }}
              >
                <div className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--brand-orange)' }}>
                  <Tag size={12} />
                  <span>Pain Hypothesis (Validation in progress):</span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{item.painHypothesis}</p>
              </div>

              {/* Next Action & Last Touch */}
              <div
                className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                style={{ borderTop: '1px solid var(--border-soft)' }}
              >
                <div className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                  <Clock size={13} style={{ color: 'var(--brand-orange)' }} />
                  <span>Next Action: {item.nextAction}</span>
                </div>

                <span style={{ color: 'var(--text-muted)' }}>
                  Last touch: {item.lastTouch}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Prospect Modal */}
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
                Add GCC Brokerage Prospect
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-white/5 cursor-pointer text-zinc-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProspect} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-300">
                  Company Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lusail Marina Brokerage"
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-300">
                    City / Market:
                  </label>
                  <select
                    value={newCity}
                    onChange={e => setNewCity(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                  >
                    <option value="Doha">Doha (Qatar)</option>
                    <option value="Dubai">Dubai (UAE)</option>
                    <option value="Riyadh">Riyadh (KSA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-300">
                    Estimated Deal Size:
                  </label>
                  <input
                    type="text"
                    value={newDealSize}
                    onChange={e => setNewDealSize(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200 font-mono"
                    placeholder="$7,500/mo"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-300">
                    Contact Person:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hamad Al-Thani"
                    value={newContact}
                    onChange={e => setNewContact(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-300">
                    Title / Role:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Managing Partner"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-300">
                  Pain Hypothesis (Rule 6.3):
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Portal inquiry response delay exceeds 4 hours on Bayut, leading to lost luxury villa buyers."
                  value={newHypothesis}
                  onChange={e => setNewHypothesis(e.target.value)}
                  className="w-full p-2.5 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-300">
                  Next Action:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Discovery call scheduled for Thursday at 3:00 PM AST"
                  value={newNextAction}
                  onChange={e => setNewNextAction(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-xs border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                />
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
                  <span>Save Prospect</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
