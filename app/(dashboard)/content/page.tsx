'use client'

import { useState, useEffect } from 'react'
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
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Sliders,
  Send,
  AlertCircle,
} from 'lucide-react'
import { ResearchTopicRecord, ContentBatchRecord, CarouselSlide, VideoScene } from '@/lib/db/types'

const SAMPLE_GEMINI_REPORT = `### Daily Content Report: GCC Real Estate Automation

---

#### Idea 1: Carousel (7-Slide Off-Plan / WhatsApp Lead Automation)
* **Title / Finding:** The 45-Second WhatsApp Qualification Engine for Off-Plan Launches
* **Target Market:** UAE (Dubai) & Saudi Arabia (Riyadh)
* **Target Angle / Hypothesis:** Off-plan launch campaigns waste up to 40% of ad spend on unqualified leads because human agents cannot triage incoming WhatsApp inquiries within the critical 3-minute response window.
* **Source Reference / Topic Link:** Meta Business Messaging API + Webhook-driven CRM ingestion (Property Finder / Bayut lead forms).
* **Slide Headlines:**
* **Slide 1:** 45 Seconds: The Exact Window That Makes or Breaks a Dubai Off-Plan Campaign
* **Slide 2:** The WhatsApp Bottleneck: Why Manual Chat Handlers Drop High-Net-Worth Buyers
* **Slide 3:** The Architecture: Ad Click -> WhatsApp Webhook -> Deterministic Triage
* **Slide 4:** Qualification Without Friction: Budget, Payment Plan, & Residency Status in 3 Prompts
* **Slide 5:** Routing Logic: Flagging Secondary Market Inquiries vs. Ready-to-Commit Off-Plan Buyers
* **Slide 6:** Live CRM Sync: Writing Full Buyer Profiles into Salesforce / HubSpot in Under a Minute
* **Slide 7 (CTA):** Comment "OFFPLAN" to receive our production WhatsApp-to-CRM automation blueprint.

---

#### Idea 2: Carousel (Case Study / Framework)
* **Title / Framework:** The Multi-Portal Inquiry Normalizer: Eliminating Duplicate Data Entry Across Property Finder, Bayut, and Wasalt
* **Target Market:** Saudi Arabia (KSA) & Qatar (Doha)
* **Target Angle / Hypothesis:** GCC brokerages listing across multiple portals suffer from fragmented lead attribution and delayed follow-ups.
* **Source Reference / Topic Link:** Event-driven architecture, webhook normalization, and schema validation for GCC property portals.
* **Slide Headlines:**
* **Slide 1:** The Portal Fragment: Why Your Top Agents Spend 2 Hours a Day Copying Lead Data
* **Slide 7 (CTA):** Comment "PORTAL" to download the GCC Multi-Portal Ingestion Schema.

---

#### Idea 3: Video Script (60-Second Avatar Script for Luxury Property Triage)
* **Title / Finding:** Triage or Lose: How to Filter $5M+ Inquiries from Tire-Kickers Without Damaging Brand Prestige
* **Target Market:** UAE (Dubai Marina / Palm Jumeirah) & Qatar (The Pearl / Lusail)
* **Target Angle / Hypothesis:** High-end brokerages cannot afford to expose ultra-HNW clients to rigid, robotic qualification forms.
* **Source Reference / Topic Link:** Conversational AI triage with natural language entity extraction for prime real estate.
* **Scene Timestamps & Script:**
* **0:00–0:15s (Hook):** *(Avatar center frame)* "If your agents treat a 20-million-dirham villa inquiry the same way they treat a rental lead, you're actively handing deals to rival brokerages."
* **0:15–0:45s (Core Insight):** *(Split screen)* "Elite brokerages in Dubai and Doha use conversational concierge triage."
* **0:45–1:00s (CTA):** *(Avatar returns to center)* "Drop the word 'LUXURY' below to get our private VIP triage workflow."

---

#### Idea 4: Static Post (Speed-to-Lead SLA Breakdown)
* **Title / Finding:** The Speed-to-Lead SLA Gap in GCC Real Estate
* **Target Market:** UAE, Qatar, and Saudi Arabia
* **Hook Headline:** **Your Inbound Leads Have a 5-Minute Half-Life. Your Average Response Time is 48 Minutes.**
* **Body Copy:** In the GCC property market, international investors submit inquiries across 3 to 5 competitor listings simultaneously. The brokerage that initiates a personalized, context-aware touchpoint within the first 300 seconds wins the dialogue 78% of the time.

---

#### Idea 5: Static Post (CRM Sync & Portal Inquiry Checklist)
* **Title / Finding:** The 5-Point GCC Brokerage Data Hygiene & Sync Audit
* **Target Market:** Saudi Arabia (Riyadh & Jeddah) & UAE
* **Hook Headline:** **The 5-Point Integration Audit Every GCC Brokerage Needs Before Their Next Launch.**
* **Body Copy:** Before scaling paid ad budgets or portal listing tiers, audit your backend integration for these 5 critical failure points: 1. E.164 Phone Formatting 2. UTM Attribution 3. Idempotent Webhook Handling 4. Dynamic Agent Capacity Routing 5. Auto-Disqualification Archival.`

export default function ContentPage() {
  const [batch, setBatch] = useState<ContentBatchRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePreviewTopic, setActivePreviewTopic] = useState<ResearchTopicRecord | null>(null)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [generatingDrafts, setGeneratingDrafts] = useState(false)
  const [draftsSuccess, setDraftsSuccess] = useState<string | null>(null)
  const [showIntakeModal, setShowIntakeModal] = useState(false)

  // New batch form state
  const [newBatchName, setNewBatchName] = useState('')
  const [newTopics, setNewTopics] = useState<Array<{
    title: string
    sourceUrl: string
    targetAngle: string
    market: 'Qatar' | 'UAE' | 'KSA' | 'GCC-General'
    relevanceScore: number
    assignedFormat: 'static' | 'carousel' | 'video' | 'skip'
  }>>([
    { title: '', sourceUrl: '', targetAngle: '', market: 'Qatar', relevanceScore: 4.8, assignedFormat: 'static' },
    { title: '', sourceUrl: '', targetAngle: '', market: 'UAE', relevanceScore: 4.6, assignedFormat: 'carousel' },
    { title: '', sourceUrl: '', targetAngle: '', market: 'GCC-General', relevanceScore: 4.4, assignedFormat: 'video' },
    { title: '', sourceUrl: '', targetAngle: '', market: 'UAE', relevanceScore: 4.2, assignedFormat: 'static' },
    { title: '', sourceUrl: '', targetAngle: '', market: 'KSA', relevanceScore: 2.1, assignedFormat: 'skip' },
  ])
  const [intakeError, setIntakeError] = useState<string | null>(null)
  const [submittingIntake, setSubmittingIntake] = useState(false)
  const [intakeTab, setIntakeTab] = useState<'paste' | 'manual'>('paste')
  const [rawReportText, setRawReportText] = useState('')

  async function loadTopics() {
    setLoading(true)
    try {
      const res = await fetch('/api/content/topics')
      if (res.ok) {
        const data = await res.json()
        setBatch(data.batch)
      }
    } catch (err) {
      console.error('Failed to load content topics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTopics()
  }, [])

  const topics = batch?.topics || []
  const staticCount = topics.filter(t => t.assignedFormat === 'static').length
  const carouselCount = topics.filter(t => t.assignedFormat === 'carousel').length
  const videoCount = topics.filter(t => t.assignedFormat === 'video').length
  const skipCount = topics.filter(t => t.assignedFormat === 'skip').length

  const isRuleCompliant =
    staticCount === 2 && carouselCount === 1 && videoCount === 1 && skipCount === 1

  async function setAllocation(topicId: string, format: 'static' | 'carousel' | 'video' | 'skip') {
    if (!batch) return

    // Optimistic UI update
    setBatch(prev => {
      if (!prev) return null
      return {
        ...prev,
        topics: prev.topics.map(t =>
          t.id === topicId ? { ...t, assignedFormat: format } : t
        ),
      }
    })

    try {
      await fetch('/api/content/topics', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: batch.id, topicId, format }),
      })
    } catch (err) {
      console.error('Failed to update format:', err)
      loadTopics()
    }
  }

  function autoBalanceAllocation() {
    if (!batch) return
    const sorted = [...batch.topics].sort((a, b) => b.relevanceScore - a.relevanceScore)
    // 1st: static, 2nd: static, 3rd: carousel, 4th: video, 5th: skip
    if (sorted[0]) setAllocation(sorted[0].id, 'static')
    if (sorted[1]) setAllocation(sorted[1].id, 'static')
    if (sorted[2]) setAllocation(sorted[2].id, 'carousel')
    if (sorted[3]) setAllocation(sorted[3].id, 'video')
    if (sorted[4]) setAllocation(sorted[4].id, 'skip')
  }

  async function handleGenerateDrafts() {
    if (!batch || generatingDrafts) return
    setGeneratingDrafts(true)
    setDraftsSuccess(null)

    try {
      const res = await fetch('/api/content/generate-drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: batch.id }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setDraftsSuccess(`Generated ${data.count} drafts and routed them to the Approvals Queue!`)
        loadTopics()
      }
    } catch (err) {
      console.error('Failed to generate drafts:', err)
    } finally {
      setGeneratingDrafts(false)
    }
  }

  async function handlePasteReportSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rawReportText.trim()) {
      setIntakeError('Please paste your Gemini report markdown.')
      return
    }
    setSubmittingIntake(true)
    setIntakeError(null)
    try {
      const res = await fetch('/api/webhooks/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: rawReportText,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to ingest report')
      }
      setShowIntakeModal(false)
      setRawReportText('')
      setDraftsSuccess(`Report parsed successfully! Ingested 5 topics and updated the database.`)
      loadTopics()
    } catch (err: any) {
      setIntakeError(err.message)
    } finally {
      setSubmittingIntake(false)
    }
  }

  async function handleIntakeSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIntakeError(null)

    if (!newBatchName.trim()) {
      setIntakeError('Please enter a batch name.')
      return
    }

    // Validate URLs
    for (let i = 0; i < 5; i++) {
      if (!newTopics[i].title.trim()) {
        setIntakeError(`Topic #${i + 1} must have a title.`)
        return
      }
      try {
        new URL(newTopics[i].sourceUrl)
      } catch {
        setIntakeError(`Topic #${i + 1} requires a valid URL (e.g. https://...).`)
        return
      }
    }

    setSubmittingIntake(true)
    try {
      const res = await fetch('/api/content/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBatchName.trim(),
          topics: newTopics,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setShowIntakeModal(false)
        loadTopics()
      } else {
        setIntakeError(data.error || 'Failed to ingest batch.')
      }
    } catch (err: any) {
      setIntakeError(err.message || 'Error submitting batch.')
    } finally {
      setSubmittingIntake(false)
    }
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
            AUTHRONIC / OPERATIONS · PHASE 3
          </p>
          <h1
            className="text-2xl sm:text-3xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
          >
            Content Studio
          </h1>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Turn 5 verified research topics into ready-to-publish assets. Rule 5.1: Target allocation 2 static · 1 carousel · 1 video · 1 skip.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowIntakeModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors hover:bg-white/5 cursor-pointer"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-soft)',
              color: 'var(--text-primary)',
            }}
          >
            <Plus size={14} style={{ color: 'var(--brand-orange)' }} />
            <span>New Research Batch</span>
          </button>

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

          <button
            onClick={handleGenerateDrafts}
            disabled={generatingDrafts}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer disabled:opacity-60"
            style={{
              background: 'var(--brand-orange)',
              color: '#101110',
            }}
          >
            {generatingDrafts ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            <span>Generate Asset Drafts</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {draftsSuccess && (
        <div
          className="p-4 rounded-xl text-xs flex items-center justify-between gap-3"
          style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.25)', color: '#4ade80' }}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} />
            <span>{draftsSuccess}</span>
          </div>
          <Link
            href="/approvals"
            className="underline font-semibold hover:opacity-80"
          >
            Go to Approvals Queue →
          </Link>
        </div>
      )}

      {/* Allocation Summary & Compliance Card */}
      <div
        className="p-4 sm:p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Batch: {batch?.name || 'Loading...'}
            </span>
            <span
              className="text-[11px] px-2 py-0.5 rounded font-medium"
              style={{
                background: isRuleCompliant ? 'rgba(74, 222, 128, 0.12)' : 'rgba(247, 143, 30, 0.12)',
                color: isRuleCompliant ? '#4ade80' : 'var(--brand-orange)',
              }}
            >
              {isRuleCompliant ? 'Rule 5.1 Compliant' : 'Allocation Needed'}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Formula Target: 2 Static Posts · 1 Carousel · 1 Video Script · 1 Skipped / Archived
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span
              className="px-2.5 py-1 rounded-lg"
              style={{
                background: 'var(--surface-2)',
                color: staticCount === 2 ? '#4ade80' : 'var(--brand-orange)',
              }}
            >
              {staticCount}/2 Static
            </span>
            <span
              className="px-2.5 py-1 rounded-lg"
              style={{
                background: 'var(--surface-2)',
                color: carouselCount === 1 ? '#4ade80' : 'var(--brand-orange)',
              }}
            >
              {carouselCount}/1 Carousel
            </span>
            <span
              className="px-2.5 py-1 rounded-lg"
              style={{
                background: 'var(--surface-2)',
                color: videoCount === 1 ? '#4ade80' : 'var(--brand-orange)',
              }}
            >
              {videoCount}/1 Video
            </span>
            <span
              className="px-2.5 py-1 rounded-lg"
              style={{
                background: 'var(--surface-2)',
                color: skipCount === 1 ? '#4ade80' : 'var(--text-muted)',
              }}
            >
              {skipCount}/1 Skip
            </span>
          </div>

          {!isRuleCompliant && (
            <button
              onClick={autoBalanceAllocation}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer"
              style={{ border: '1px solid var(--brand-orange)', color: 'var(--brand-orange)' }}
              title="Auto-assign formats based on topic relevance scores"
            >
              <Sliders size={12} />
              <span>Auto-Balance</span>
            </button>
          )}
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-16 text-center text-xs flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Loader2 size={16} className="animate-spin text-[var(--brand-orange)]" />
            <span>Loading research batch...</span>
          </div>
        ) : (
          topics.map((topic, i) => (
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
                  <span
                    className="text-xs px-2 py-0.5 rounded font-mono"
                    style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
                  >
                    Relevance: {topic.relevanceScore} / 5.0
                  </span>
                  <span
                    className="text-[11px] px-2 py-0.5 rounded font-semibold uppercase"
                    style={{ background: 'rgba(247, 143, 30, 0.1)', color: 'var(--brand-orange)' }}
                  >
                    {topic.market}
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
                  <span className="font-semibold" style={{ color: 'var(--brand-orange)' }}>Angle:</span>{' '}
                  {topic.targetAngle}
                </p>
              </div>

              <div
                className="pt-2.5 flex items-center justify-between text-xs flex-wrap gap-2"
                style={{ borderTop: '1px solid var(--border-soft)' }}
              >
                <a
                  href={topic.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono truncate max-w-sm sm:max-w-md hover:underline flex items-center gap-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span>Source: {topic.sourceUrl}</span>
                  <ExternalLink size={10} />
                </a>

                {topic.assignedFormat !== 'skip' && (
                  <button
                    onClick={() => {
                      setActivePreviewTopic(topic)
                      setActiveSlideIndex(0)
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ color: 'var(--brand-orange)', border: '1px solid var(--border-soft)' }}
                  >
                    <Eye size={12} />
                    <span>Preview {topic.assignedFormat === 'carousel' ? 'Slides' : topic.assignedFormat === 'video' ? 'Script' : 'Draft'}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Format-Specific Review Drawer Modal */}
      {activePreviewTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
          >
            {/* Drawer Header */}
            <div
              className="p-5 flex items-center justify-between border-b"
              style={{ borderColor: 'var(--border-soft)', background: 'var(--surface-2)' }}
            >
              <div>
                <span
                  className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded"
                  style={{ background: 'rgba(247, 143, 30, 0.15)', color: 'var(--brand-orange)' }}
                >
                  {activePreviewTopic.assignedFormat.toUpperCase()} DRAFT PREVIEW
                </span>
                <h3 className="text-base font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                  {activePreviewTopic.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePreviewTopic(null)}
                className="p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Carousel Format Viewer */}
              {activePreviewTopic.assignedFormat === 'carousel' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      Slide {activeSlideIndex + 1} of {activePreviewTopic.slides?.length || 7}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                        disabled={activeSlideIndex === 0}
                        className="p-1.5 rounded-lg border hover:bg-white/5 cursor-pointer disabled:opacity-30"
                        style={{ borderColor: 'var(--border-soft)', color: 'var(--text-primary)' }}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setActiveSlideIndex(prev =>
                            Math.min((activePreviewTopic.slides?.length || 7) - 1, prev + 1)
                          )
                        }
                        disabled={
                          activeSlideIndex === (activePreviewTopic.slides?.length || 7) - 1
                        }
                        className="p-1.5 rounded-lg border hover:bg-white/5 cursor-pointer disabled:opacity-30"
                        style={{ borderColor: 'var(--border-soft)', color: 'var(--text-primary)' }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Visual Slide Frame */}
                  {activePreviewTopic.slides?.[activeSlideIndex] && (
                    <div
                      className="aspect-[4/3] rounded-xl p-8 flex flex-col justify-between shadow-inner relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #181918 0%, #0F100F 100%)',
                        border: '2px solid rgba(247, 143, 30, 0.3)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
                          AUTHRONIC · OFF-PLAN LEAD AUTOMATION
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                          style={{ background: 'var(--brand-orange)', color: '#101110' }}
                        >
                          SLIDE 0{activeSlideIndex + 1}
                        </span>
                      </div>

                      <div className="space-y-3 my-auto">
                        <h2 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                          {activePreviewTopic.slides[activeSlideIndex].headline}
                        </h2>
                        <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {activePreviewTopic.slides[activeSlideIndex].bodyText}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10 text-[11px] text-zinc-500 font-mono">
                        <span>{activePreviewTopic.slides[activeSlideIndex].visualNote}</span>
                        <span>Swipe ➔</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Video Script Viewer */}
              {activePreviewTopic.assignedFormat === 'video' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(247, 143, 30, 0.08)', border: '1px solid rgba(247, 143, 30, 0.2)' }}>
                    <span className="font-semibold" style={{ color: 'var(--brand-orange)' }}>
                      60-Second Short-Form Avatar Video Script
                    </span>
                    <p className="text-zinc-400 mt-0.5">
                      Targeted pacing: 140 words per minute with synchronized on-screen caption cuts.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {(activePreviewTopic.scenes || []).map(scene => (
                      <div
                        key={scene.sceneNumber}
                        className="p-4 rounded-xl space-y-2"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border-soft)' }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold" style={{ color: 'var(--brand-orange)' }}>
                            Scene #{scene.sceneNumber} · {scene.timestampRange}
                          </span>
                          <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            {scene.visualAction}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                          "{scene.speakerText}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Static Post Viewer */}
              {activePreviewTopic.assignedFormat === 'static' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl space-y-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-soft)' }}>
                    <div className="text-xs font-mono font-bold" style={{ color: 'var(--brand-orange)' }}>
                      HOOK HEADLINE:
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {activePreviewTopic.staticCopy?.hook}
                    </p>

                    <div className="text-xs font-mono font-bold pt-2" style={{ color: 'var(--brand-orange)' }}>
                      BODY COPY:
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                      {activePreviewTopic.staticCopy?.body}
                    </p>

                    <div className="text-xs font-mono font-bold pt-2" style={{ color: 'var(--brand-orange)' }}>
                      CALL TO ACTION & CITATIONS:
                    </div>
                    <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
                      {activePreviewTopic.staticCopy?.cta}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {activePreviewTopic.staticCopy?.hashtags?.map(h => (
                        <span key={h} className="text-xs font-mono" style={{ color: 'var(--brand-orange)' }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div
              className="p-4 border-t flex items-center justify-end gap-3"
              style={{ borderColor: 'var(--border-soft)', background: 'var(--surface-2)' }}
            >
              <button
                onClick={() => setActivePreviewTopic(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 cursor-pointer"
                style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-soft)' }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Research Batch Intake Modal */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
          >
            <div
              className="p-5 flex items-center justify-between border-b"
              style={{ borderColor: 'var(--border-soft)', background: 'var(--surface-2)' }}
            >
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Ingest 5-Topic Research Batch
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Rule 5.1: Provide exactly 5 verified market hypotheses with active source URLs.
                </p>
              </div>
              <button
                onClick={() => setShowIntakeModal(false)}
                className="p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b text-xs font-semibold px-6 pt-3 gap-6" style={{ borderColor: 'var(--border-soft)', background: 'var(--surface-2)' }}>
              <button
                type="button"
                onClick={() => setIntakeTab('paste')}
                className={`pb-2.5 transition-all cursor-pointer ${intakeTab === 'paste' ? 'border-b-2 text-[var(--brand-orange)] border-[var(--brand-orange)] font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                ⚡ Paste Gemini Report (Instant)
              </button>
              <button
                type="button"
                onClick={() => setIntakeTab('manual')}
                className={`pb-2.5 transition-all cursor-pointer ${intakeTab === 'manual' ? 'border-b-2 text-[var(--brand-orange)] border-[var(--brand-orange)] font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                📝 Manual 5-Topic Form
              </button>
            </div>

            {intakeTab === 'paste' ? (
              <form onSubmit={handlePasteReportSubmit} className="p-6 overflow-y-auto space-y-4">
                {intakeError && (
                  <div className="p-3 rounded-lg text-xs flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20">
                    <AlertCircle size={14} />
                    <span>{intakeError}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      Paste Raw Gemini Daily Content Report:
                    </label>
                    <button
                      type="button"
                      onClick={() => setRawReportText(SAMPLE_GEMINI_REPORT)}
                      className="text-[11px] font-mono text-[var(--brand-orange)] hover:underline cursor-pointer"
                    >
                      Fill Sample Report
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    placeholder="Paste the daily report from Google Gemini here (Markdown, carousels, video scripts, static posts)..."
                    value={rawReportText}
                    onChange={e => setRawReportText(e.target.value)}
                    className="w-full p-3 rounded-lg text-xs font-mono border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                    required
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    The autonomous intake parser extracts all 5 ideas, slides, video timestamps, and copy automatically into the database.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border-soft)]">
                  <button
                    type="button"
                    onClick={() => setShowIntakeModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 cursor-pointer text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingIntake}
                    className="px-5 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-orange)] text-[#101110] hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {submittingIntake && <Loader2 size={13} className="animate-spin" />}
                    <span>⚡ Parse & Ingest Into Database</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleIntakeSubmit} className="p-6 overflow-y-auto space-y-4">
                {intakeError && (
                  <div className="p-3 rounded-lg text-xs flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20">
                    <AlertCircle size={14} />
                    <span>{intakeError}</span>
                  </div>
                )}

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Batch Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. GCC PropTech Weekly Research · Nov 2026"
                  value={newBatchName}
                  onChange={e => setNewBatchName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-xs border focus:outline-none"
                  style={{
                    background: 'var(--surface-2)',
                    borderColor: 'var(--border-soft)',
                    color: 'var(--text-primary)',
                  }}
                  required
                />
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-orange)' }}>
                  5 Research Topics:
                </span>
                {newTopics.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl space-y-2"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border-soft)' }}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[var(--brand-orange)]">Topic #{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <select
                          value={t.market}
                          onChange={e => {
                            const updated = [...newTopics]
                            updated[idx].market = e.target.value as any
                            setNewTopics(updated)
                          }}
                          className="h-7 px-2 rounded text-[11px] border focus:outline-none bg-[var(--surface-1)] border-[var(--border-soft)] text-zinc-300"
                        >
                          <option value="Qatar">Qatar</option>
                          <option value="UAE">UAE</option>
                          <option value="KSA">KSA</option>
                          <option value="GCC-General">GCC-General</option>
                        </select>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Topic Title / Finding"
                      value={t.title}
                      onChange={e => {
                        const updated = [...newTopics]
                        updated[idx].title = e.target.value
                        setNewTopics(updated)
                      }}
                      className="w-full h-8 px-2.5 rounded text-xs border focus:outline-none bg-[var(--surface-1)] border-[var(--border-soft)] text-zinc-200"
                      required
                    />
                    <input
                      type="url"
                      placeholder="Source URL (e.g. https://...)"
                      value={t.sourceUrl}
                      onChange={e => {
                        const updated = [...newTopics]
                        updated[idx].sourceUrl = e.target.value
                        setNewTopics(updated)
                      }}
                      className="w-full h-8 px-2.5 rounded text-xs border focus:outline-none bg-[var(--surface-1)] border-[var(--border-soft)] text-zinc-200"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border-soft)]">
                <button
                  type="button"
                  onClick={() => setShowIntakeModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 cursor-pointer text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingIntake}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-orange)] text-[#101110] hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submittingIntake && <Loader2 size={13} className="animate-spin" />}
                  <span>Save & Ingest Batch</span>
                </button>
              </div>
            </form>
          )}
        </div>
        </div>
      )}
    </div>
  )
}
