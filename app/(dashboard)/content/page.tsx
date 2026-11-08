'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Plus,
  Sparkles,
  Layers,
  Video,
  Archive,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Calendar,
} from 'lucide-react'

interface ResearchTopic {
  id: string
  title: string
  sourceUrl: string
  relevanceScore: number
  assignedFormat: 'static' | 'carousel' | 'video' | 'skip'
  targetAngle: string
}

const initialTopics: ResearchTopic[] = [
  {
    id: 'top-1',
    title: 'Qatar Real Estate Portals Lead Leakage: Why 40% of Inbound Buyers Receive No Callback within 2 Hours',
    sourceUrl: 'https://example.com/qatar-property-trends-2026',
    relevanceScore: 4.8,
    assignedFormat: 'static',
    targetAngle: 'Speed-to-lead SLA breakdown for Doha independent agencies',
  },
  {
    id: 'top-2',
    title: 'Off-Plan WhatsApp Automation: How Top Dubai Agencies Handle 200+ Daily Portal Leads',
    sourceUrl: 'https://example.com/dubai-offplan-inquiries',
    relevanceScore: 4.6,
    assignedFormat: 'carousel',
    targetAngle: '7-slide workflow comparison: manual vs automated qualification',
  },
  {
    id: 'top-3',
    title: 'AI Video Triage for Luxury GCC Listings: Enhancing High-Net-Worth Buyer Engagement',
    sourceUrl: 'https://example.com/gcc-luxury-tech',
    relevanceScore: 4.2,
    assignedFormat: 'video',
    targetAngle: 'Avatar video demonstration explaining 24/7 VIP buyer intake',
  },
  {
    id: 'top-4',
    title: 'Automated CRM Sync: Preventing Portal Inquiry Drops Between PropertyFinder & Local CRM',
    sourceUrl: 'https://example.com/crm-sync-realestate',
    relevanceScore: 4.5,
    assignedFormat: 'static',
    targetAngle: 'Practical technical checklist for agency operations leads',
  },
  {
    id: 'top-5',
    title: 'Generic US Real Estate Agent Marketing Strategies (Not Localized to GCC)',
    sourceUrl: 'https://example.com/us-generic-marketing',
    relevanceScore: 1.8,
    assignedFormat: 'skip',
    targetAngle: 'Out of regional scope; archived from batch',
  },
]

export default function ContentPage() {
  const [topics, setTopics] = useState<ResearchTopic[]>(initialTopics)

  const staticCount = topics.filter(t => t.assignedFormat === 'static').length
  const carouselCount = topics.filter(t => t.assignedFormat === 'carousel').length
  const videoCount = topics.filter(t => t.assignedFormat === 'video').length
  const skipCount = topics.filter(t => t.assignedFormat === 'skip').length

  function setAllocation(id: string, format: 'static' | 'carousel' | 'video' | 'skip') {
    setTopics(prev =>
      prev.map(t => (t.id === id ? { ...t, assignedFormat: format } : t))
    )
  }

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
            Content Studio
          </h1>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            From 5 researched topic ideas to publication-ready assets. Rule 5.1: Target allocation 2 static · 1 carousel · 1 video · 1 skip.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/content/calendar"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors hover:bg-white/5"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-soft)',
              color: 'var(--text-primary)',
            }}
          >
            <Calendar size={14} style={{ color: 'var(--brand-orange)' }} />
            <span>View Calendar</span>
          </Link>
          <Link
            href="/approvals"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: 'var(--brand-orange)',
              color: '#101110',
            }}
          >
            <span>Review Queue</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Allocation Summary Card */}
      <div
        className="p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Current Batch: batch-20261108-01
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'var(--surface-2)', color: 'var(--brand-orange)' }}>
              5 Topics Ingested
            </span>
          </div>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
            Allocation Target Compliance:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-lg" style={{ background: 'var(--surface-2)', color: staticCount === 2 ? '#34D399' : 'var(--brand-orange)' }}>
            {staticCount}/2 Static Posts
          </span>
          <span className="px-3 py-1 rounded-lg" style={{ background: 'var(--surface-2)', color: carouselCount === 1 ? '#34D399' : 'var(--brand-orange)' }}>
            {carouselCount}/1 Carousel
          </span>
          <span className="px-3 py-1 rounded-lg" style={{ background: 'var(--surface-2)', color: videoCount === 1 ? '#34D399' : 'var(--brand-orange)' }}>
            {videoCount}/1 Video
          </span>
          <span className="px-3 py-1 rounded-lg" style={{ background: 'var(--surface-2)', color: skipCount === 1 ? '#34D399' : 'var(--text-muted)' }}>
            {skipCount}/1 Skipped
          </span>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {topics.map((topic, i) => (
          <div
            key={topic.id}
            className="p-5 rounded-xl space-y-3 transition-colors"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-soft)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold" style={{ color: 'var(--brand-orange)' }}>
                  #{i + 1}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                  Relevance: {topic.relevanceScore} / 5.0
                </span>
              </div>

              {/* Format selection buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['static', 'carousel', 'video', 'skip'] as const).map(fmt => {
                  const isSelected = topic.assignedFormat === fmt
                  return (
                    <button
                      key={fmt}
                      onClick={() => setAllocation(topic.id, fmt)}
                      className="px-2.5 py-1 rounded text-xs font-medium capitalize transition-all cursor-pointer"
                      style={{
                        background: isSelected ? 'var(--brand-orange)' : 'var(--surface-2)',
                        color: isSelected ? '#101110' : 'var(--text-secondary)',
                        fontWeight: isSelected ? 600 : 500,
                      }}
                    >
                      {fmt === 'static' ? 'Static Post' : fmt}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {topic.title}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-semibold" style={{ color: 'var(--brand-orange)' }}>Angle:</span> {topic.targetAngle}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs" style={{ borderTop: '1px solid var(--border-soft)' }}>
              <span className="text-[11px] font-mono truncate max-w-md" style={{ color: 'var(--text-muted)' }}>
                Source: {topic.sourceUrl}
              </span>
              <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                Status: Verified Hypothesis
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
