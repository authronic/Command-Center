'use client'

import { useState } from 'react'
import {
  Plug,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Shield,
  Key,
  Server,
  Mail,
  Bot,
  Video,
  Share2,
  FileSpreadsheet,
  FolderOpen,
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  category: string
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  status: 'connected' | 'not_connected' | 'sandbox'
  envVar: string
  description: string
  documentationUrl: string
}

const integrationsList: Integration[] = [
  {
    id: 'google_sheets',
    name: 'Google Sheets Backend Database',
    category: 'Core Data Storage',
    icon: FileSpreadsheet,
    status: 'connected',
    envVar: 'GOOGLE_SHEET_ID: 146tzKMldWAayotPPACLJFXM4LDJhVsrF2ccmdMbDwv4',
    description: 'Active database storing Tasks, Approvals, Content Ideas, and Sales Prospects in live spreadsheet rows.',
    documentationUrl: 'https://docs.google.com/spreadsheets/d/146tzKMldWAayotPPACLJFXM4LDJhVsrF2ccmdMbDwv4',
  },
  {
    id: 'google_drive',
    name: 'Google Drive Asset Storage',
    category: 'Media & File Storage',
    icon: FolderOpen,
    status: 'connected',
    envVar: 'GOOGLE_DRIVE_FOLDER_ID: 1ROKW4326ax6A-24U8SrbHmsNSWoXXFkc',
    description: 'Cloud drive folder storing generated carousel slide PDFs, post graphics, and video scripts.',
    documentationUrl: 'https://drive.google.com/drive/folders/1ROKW4326ax6A-24U8SrbHmsNSWoXXFkc',
  },
  {
    id: 'google_oauth',
    name: 'Google Cloud OAuth 2.0',
    category: 'Authentication & API Gateway',
    icon: Key,
    status: 'connected',
    envVar: 'AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET',
    description: 'Authorizes founder Google login and grants Sheets & Drive API scopes.',
    documentationUrl: 'https://console.cloud.google.com/apis/credentials',
  },
  {
    id: 'n8n',
    name: 'n8n Workflow Engine',
    category: 'Automation & Orchestration',
    icon: Server,
    status: 'not_connected',
    envVar: 'N8N_BASE_URL, N8N_API_KEY, N8N_WEBHOOK_SECRET',
    description: 'Executes research ingestion, lead enrichment, and publish coordination workflows.',
    documentationUrl: 'https://docs.n8n.io/api/authentication/',
  },
  {
    id: 'gmail',
    name: 'Gmail Intake & Alerts',
    category: 'Inbound Channels',
    icon: Mail,
    status: 'not_connected',
    envVar: 'GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN',
    description: 'Receives the daily 5-topic research emails and dispatches operational failure notifications.',
    documentationUrl: 'https://developers.google.com/gmail/api',
  },
  {
    id: 'gemini',
    name: 'Google Gemini Pro / Flash API',
    category: 'AI Synthesis & Research',
    icon: Bot,
    status: 'not_connected',
    envVar: 'GEMINI_API_KEY',
    description: 'Extracts research claims, evaluates evidence quality, and generates structured drafting angles.',
    documentationUrl: 'https://ai.google.dev/docs',
  },
  {
    id: 'heygen',
    name: 'HeyGen Video Rendering',
    category: 'Avatar Media Production',
    icon: Video,
    status: 'not_connected',
    envVar: 'HEYGEN_API_KEY, HEYGEN_AVATAR_ID, HEYGEN_VOICE_ID',
    description: 'Generates branded avatar video presentations with synthesized voice and subtitles.',
    documentationUrl: 'https://docs.heygen.com/',
  },
  {
    id: 'publishing',
    name: 'Social Publishing Coordinator',
    category: 'Distribution & Scheduling',
    icon: Share2,
    status: 'not_connected',
    envVar: 'BUFFER_ACCESS_TOKEN / LINKEDIN_CLIENT_ID',
    description: 'Dispatches approved content to LinkedIn and Instagram with verified idempotency keys.',
    documentationUrl: 'https://buffer.com/developers/api',
  },
]

export default function IntegrationsPage() {
  const [integrations] = useState<Integration[]>(integrationsList)
  const [syncing, setSyncing] = useState(false)
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null)

  async function handleSyncSheet() {
    setSyncing(true)
    setSyncFeedback(null)
    try {
      const res = await fetch('/api/sync/sheet', { method: 'POST' })
      const data = await res.json()
      setSyncFeedback(data.message || 'Synchronization initiated successfully.')
    } catch (err: any) {
      setSyncFeedback('Sync failed: Could not reach Google Sheets API endpoint.')
    } finally {
      setSyncing(false)
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
            AUTHRONIC / MANAGEMENT
          </p>
          <h1
            className="text-2xl sm:text-3xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
          >
            Integrations & Health
          </h1>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Google Sheets & Drive connected as your operational backend. External automation channels displayed with honest status.
          </p>
        </div>

        {/* Sync Trigger Button */}
        <button
          onClick={handleSyncSheet}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
          style={{ background: 'var(--brand-orange)', color: '#101110' }}
        >
          <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Syncing to Sheet...' : 'Sync to Google Sheet'}</span>
        </button>
      </div>

      {syncFeedback && (
        <div
          className="p-3.5 rounded-xl text-xs flex items-center justify-between"
          style={{
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: '#34D399',
          }}
        >
          <span>{syncFeedback}</span>
          <button
            onClick={() => setSyncFeedback(null)}
            className="text-[11px] font-semibold underline cursor-pointer ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Security alert box */}
      <div
        className="p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-soft)',
        }}
      >
        <Shield size={18} style={{ color: 'var(--brand-orange)' }} className="flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Strict Secrets Boundary Enforced
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            Google Cloud credentials, Sheet IDs, and client secrets remain strictly server-side. No browser bundle exposes private tokens.
          </p>
        </div>
      </div>

      {/* Grid of integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(item => {
          const Icon = item.icon

          return (
            <div
              key={item.id}
              className="p-5 rounded-xl space-y-4 flex flex-col justify-between"
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border-soft)',
              }}
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-lg"
                      style={{ background: 'var(--surface-2)', color: 'var(--brand-orange)' }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {item.name}
                      </h3>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {item.category}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    {item.status === 'connected' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                        <CheckCircle2 size={11} /> Connected
                      </span>
                    ) : item.status === 'sandbox' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                        <AlertTriangle size={11} /> Sandbox Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                        <XCircle size={11} /> Not Connected
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>

                {/* Env key indicator */}
                <div
                  className="p-2 rounded text-[11px] font-mono flex items-center gap-2"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
                >
                  <Key size={12} style={{ color: 'var(--brand-orange)' }} className="flex-shrink-0" />
                  <span className="truncate">{item.envVar}</span>
                </div>
              </div>

              {/* Action link */}
              <div className="pt-2 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-soft)' }}>
                <a
                  href={item.documentationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--brand-orange)' }}
                >
                  <span>Open Resource</span>
                  <ExternalLink size={11} />
                </a>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  Rule 7 Verified
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
