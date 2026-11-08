'use client'

import { useState } from 'react'
import {
  Bot,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  Shield,
  Clock,
  Play,
  RotateCcw,
} from 'lucide-react'

interface AgentRegistryEntry {
  id: string
  code: string
  name: string
  engine: 'Content Engine' | 'Sales Engine' | 'System Health'
  status: 'Ready' | 'Not configured' | 'Standby'
  model: string
  purpose: string
  lastRun: string
  n8nWorkflow: string
}

const registeredAgents: AgentRegistryEntry[] = [
  {
    id: 'ag-1',
    code: 'AUTH-C01',
    name: 'Research Intake Agent',
    engine: 'Content Engine',
    status: 'Standby',
    model: 'Rule-based / Parser',
    purpose: 'Ingests 5-topic research emails from Gmail, extracts citations, deduplicates IDs.',
    lastRun: '45m ago (Failed validation)',
    n8nWorkflow: 'WF-Research-Intake',
  },
  {
    id: 'ag-2',
    code: 'AUTH-C02',
    name: 'Research Enrichment & Scoring',
    engine: 'Content Engine',
    status: 'Ready',
    model: 'Gemini 1.5 Pro / Flash',
    purpose: 'Scores topics on relevance, credibility, and originality; proposes 2 static, 1 carousel, 1 video, 1 skip allocation.',
    lastRun: '2 hours ago',
    n8nWorkflow: 'WF-Research-Scoring',
  },
  {
    id: 'ag-3',
    code: 'AUTH-C03',
    name: 'Content Draft & Asset Producer',
    engine: 'Content Engine',
    status: 'Ready',
    model: 'Claude 3.5 Sonnet / Gemini',
    purpose: 'Generates structured copy, hook variations, carousel slide layouts, and video scene beats.',
    lastRun: '3 hours ago',
    n8nWorkflow: 'WF-Content-Drafting',
  },
  {
    id: 'ag-4',
    code: 'AUTH-C04',
    name: 'Publishing Coordinator',
    engine: 'Content Engine',
    status: 'Not configured',
    model: 'Deterministic Coordinator',
    purpose: 'Acquires idempotency locks and submits authorized posts to social publishing adapters.',
    lastRun: 'Never',
    n8nWorkflow: 'WF-Publish-Coordinator',
  },
  {
    id: 'ag-5',
    code: 'AUTH-S01',
    name: 'Company Research Intake',
    engine: 'Sales Engine',
    status: 'Ready',
    model: 'Gemini Flash + Web Search',
    purpose: 'Researches Qatar (Doha) & UAE (Dubai) brokerages and prepares pain hypotheses.',
    lastRun: '3 hours ago',
    n8nWorkflow: 'WF-Company-Intake',
  },
  {
    id: 'ag-6',
    code: 'AUTH-S02',
    name: 'CRM Task & Follow-up Agent',
    engine: 'Sales Engine',
    status: 'Ready',
    model: 'Deterministic Engine',
    purpose: 'Monitors deal stages and automatically creates internal reminder tasks for the founder.',
    lastRun: '1 hour ago',
    n8nWorkflow: 'WF-CRM-Reminders',
  },
  {
    id: 'ag-7',
    code: 'AUTH-S03',
    name: 'Proposal Preparation Assistant',
    engine: 'Sales Engine',
    status: 'Not configured',
    model: 'ChatGPT Work / Model Gateway',
    purpose: 'Synthesizes discovery notes into customized lead operation proposals (human review mandatory).',
    lastRun: 'Never',
    n8nWorkflow: 'WF-Proposal-Draft',
  },
  {
    id: 'ag-8',
    code: 'AUTH-SYS-01',
    name: 'System Error Monitor',
    engine: 'System Health',
    status: 'Ready',
    model: 'Diagnostics Watchdog',
    purpose: 'Classifies failure events from n8n callbacks and alerts the founder via email and dashboard.',
    lastRun: 'Active watchdog',
    n8nWorkflow: 'WF-Error-Watchdog',
  },
]

export default function AgentsPage() {
  const [agents] = useState<AgentRegistryEntry[]>(registeredAgents)

  return (
    <div className="max-w-[1480px] mx-auto space-y-6">
      {/* Header */}
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
          AI Agents Registry
        </h1>
        <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          Logical agents coordinating Content and Sales operations. Built for human oversight with explicit permissions.
        </p>
      </div>

      {/* Grid of Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="p-5 sm:p-6 rounded-xl space-y-3 flex flex-col justify-between"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-soft)',
            }}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-lg"
                    style={{ background: 'var(--surface-2)', color: 'var(--brand-orange)' }}
                  >
                    <Bot size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold" style={{ color: 'var(--brand-orange)' }}>
                        {agent.code}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                        {agent.engine}
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                      {agent.name}
                    </h2>
                  </div>
                </div>

                <div>
                  {agent.status === 'Ready' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 size={11} /> Sandbox Ready
                    </span>
                  ) : agent.status === 'Standby' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                      <Clock size={11} /> Standby
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                      <XCircle size={11} /> Not Configured
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {agent.purpose}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 rounded" style={{ background: 'var(--surface-2)' }}>
                  <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Model / Engine</span>
                  <span className="font-medium truncate block" style={{ color: 'var(--text-primary)' }}>{agent.model}</span>
                </div>
                <div className="p-2 rounded" style={{ background: 'var(--surface-2)' }}>
                  <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>n8n Workflow</span>
                  <span className="font-mono truncate block" style={{ color: 'var(--brand-orange)' }}>{agent.n8nWorkflow}</span>
                </div>
              </div>
            </div>

            <div
              className="pt-3 flex items-center justify-between text-xs"
              style={{ borderTop: '1px solid var(--border-soft)', color: 'var(--text-muted)' }}
            >
              <span>Last run: {agent.lastRun}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-2)' }}>
                Deterministic Gate
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
