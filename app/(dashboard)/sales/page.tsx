'use client'

import { useState } from 'react'
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
} from 'lucide-react'

interface Prospect {
  id: string
  name: string
  city: 'Dubai' | 'Doha'
  country: 'UAE' | 'Qatar'
  businessType: string
  stage: 'Researching' | 'Qualified' | 'Contact approved' | 'Conversation' | 'Discovery' | 'Proposal'
  fitScore: number
  painHypothesis: string
  nextAction: string
  lastTouch: string
}

const initialProspects: Prospect[] = [
  {
    id: 'pros-1',
    name: 'Example Brokerage A',
    city: 'Dubai',
    country: 'UAE',
    businessType: 'Independent Luxury Real Estate Agency',
    stage: 'Discovery',
    fitScore: 4.7,
    painHypothesis: 'Weekend inquiry drop-off: off-plan leads on Bayut wait >4h for initial WhatsApp qualification.',
    nextAction: 'Discovery call with Managing Director today at 4:00 PM',
    lastTouch: 'Yesterday · Email intro confirmed',
  },
  {
    id: 'pros-2',
    name: 'Example Brokerage B',
    city: 'Doha',
    country: 'Qatar',
    businessType: 'Boutique Commercial & Residential Leasing',
    stage: 'Qualified',
    fitScore: 4.4,
    painHypothesis: 'Manual CRM data entry between PropertyFinder and local spreadsheets causing double-booked viewings.',
    nextAction: 'Prepare customized discovery brief on speed-to-lead automation',
    lastTouch: '2 days ago · Public data verified',
  },
  {
    id: 'pros-3',
    name: 'Example Agency C',
    city: 'Dubai',
    country: 'UAE',
    businessType: 'High-volume Off-Plan Brokerage',
    stage: 'Researching',
    fitScore: 4.1,
    painHypothesis: 'High agent turnover in outbound SDR team; evaluating automated lead triage.',
    nextAction: 'Verify verified agent license on Dubai DLD registry',
    lastTouch: '3 days ago · Initial intake',
  },
]

export default function SalesPage() {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('all')

  const filtered = prospects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.businessType.toLowerCase().includes(search.toLowerCase())
    const matchesStage = stageFilter === 'all' || p.stage === stageFilter
    return matchesSearch && matchesStage
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
            Sales CRM — GCC Market Testing
          </h1>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Real estate lead operations validation in Doha, Qatar and Dubai, UAE. Human approval required before any outreach.
          </p>
        </div>

        {/* Demo banner badge */}
        <span
          className="text-xs px-3 py-1.5 rounded-lg font-mono self-start sm:self-auto"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-soft)',
            color: 'var(--brand-orange)',
          }}
        >
          Rule 9: Fixture Data Only
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div
        className="p-4 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search companies by name, market, or business type..."
            className="bg-transparent text-xs sm:text-sm outline-none flex-1"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Discovery', 'Qualified', 'Researching'].map(stage => (
            <button
              key={stage}
              onClick={() => setStageFilter(stage)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors flex-shrink-0 cursor-pointer"
              style={{
                background: stageFilter === stage ? 'rgba(247, 143, 30, 0.12)' : 'var(--surface-2)',
                color: stageFilter === stage ? 'var(--brand-orange)' : 'var(--text-secondary)',
                border: stageFilter === stage ? '1px solid var(--brand-orange)' : '1px solid var(--border-soft)',
              }}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Prospects List */}
      <div className="space-y-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-xl space-y-4 transition-colors"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-soft)',
            }}
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-lg"
                  style={{ background: 'var(--surface-2)', color: 'var(--brand-orange)' }}
                >
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.name}
                    </h2>
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                      <MapPin size={11} />
                      {item.city}, {item.country}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {item.businessType}
                  </p>
                </div>
              </div>

              {/* Stage badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-400">
                  {item.stage}
                </span>
                <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-800 text-zinc-300">
                  Fit: {item.fitScore}/5.0
                </span>
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
        ))}
      </div>
    </div>
  )
}
