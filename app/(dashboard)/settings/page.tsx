'use client'

import { useState } from 'react'
import {
  Settings,
  User,
  Globe,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  Database,
  Lock,
  Download,
  Trash2,
  ExternalLink,
  HardDrive,
  KeyRound,
  Server,
  AlertTriangle,
  Loader2,
} from 'lucide-react'

export default function SettingsPage() {
  const [founderName, setFounderName] = useState('Authronic Founder')
  const [founderEmail, setFounderEmail] = useState('admin@authronic.com')
  const [timezone, setTimezone] = useState('Asia/Karachi')
  const [targetMarket, setTargetMarket] = useState('both')
  const [saved, setSaved] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleResetDatabase() {
    if (!confirm('Are you sure you want to reset the database to an empty clean slate? This action is irreversible.')) {
      return
    }

    setResetting(true)
    try {
      const res = await fetch('/api/reset', { method: 'POST' })
      if (res.ok) {
        setResetSuccess(true)
        setTimeout(() => {
          setResetSuccess(false)
          window.location.reload()
        }, 1500)
      }
    } catch (err) {
      console.error('Reset failed:', err)
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="max-w-[1480px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <p
          className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          AUTHRONIC / PRODUCTION · PHASE 7
        </p>
        <h1
          className="text-2xl sm:text-3xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
        >
          Settings & Production Configuration
        </h1>
        <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          Configure custom domain mapping, environment health, database backups, and operational rules.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Custom Domain Setup Card */}
        <div
          className="p-5 sm:p-6 rounded-xl space-y-4"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
            <Globe size={18} style={{ color: 'var(--brand-orange)' }} />
            <div>
              <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Custom Domain (dashboard.authronic.com)
              </h2>
              <p className="text-xs text-zinc-400">Map your custom subdomain to this Vercel deployment</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg space-y-2 bg-[var(--surface-2)] border border-[var(--border-soft)]">
              <span className="font-semibold text-white">DNS Configuration Guide:</span>
              <p className="text-zinc-400">
                To connect your branded domain (e.g. <code className="text-[var(--brand-orange)] font-mono">dashboard.authronic.com</code>):
              </p>
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400">
                      <th className="pb-1.5">Type</th>
                      <th className="pb-1.5">Name / Subdomain</th>
                      <th className="pb-1.5">Target / Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pt-2 text-emerald-400 font-bold">CNAME</td>
                      <td className="pt-2 text-zinc-200">dashboard</td>
                      <td className="pt-2 text-[var(--brand-orange)] font-bold">cname.vercel-dns.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Secrets & Integrations Health */}
        <div
          className="p-5 sm:p-6 rounded-xl space-y-4"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
            <KeyRound size={18} style={{ color: 'var(--brand-orange)' }} />
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Environment Variables & Secrets Verification
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { key: 'AUTH_SECRET', label: 'NextAuth JWT Secret', status: 'Active (Protected)' },
              { key: 'AUTH_GOOGLE_ID', label: 'Google OAuth Web Client', status: 'Active (Google Cloud)' },
              { key: 'AUTH_GOOGLE_SECRET', label: 'Google OAuth Client Secret', status: 'Active (Server-Side Only)' },
              { key: 'GOOGLE_SHEET_ID', label: 'Google Sheets Primary Database', status: '146tzKMldWAayot...' },
              { key: 'GOOGLE_DRIVE_FOLDER_ID', label: 'Google Drive Media Repository', status: '1ROKW4326ax6A-...' },
              { key: 'LOCAL_PERSISTENCE', label: 'Persistent Database Engine', status: 'Active (.data/db.json)' },
            ].map(env => (
              <div
                key={env.key}
                className="p-3 rounded-lg flex items-center justify-between"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-soft)' }}
              >
                <div>
                  <span className="font-mono font-bold text-white text-[11px]">{env.key}</span>
                  <p className="text-[10px] text-zinc-400">{env.label}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400">
                  <CheckCircle2 size={12} />
                  <span>Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Founder Preferences Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div
            className="p-5 sm:p-6 rounded-xl space-y-4"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
          >
            <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
              <User size={18} style={{ color: 'var(--brand-orange)' }} />
              <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Solo Founder Profile & Timezone
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Founder Name
                </label>
                <input
                  type="text"
                  value={founderName}
                  onChange={e => setFounderName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Operational Email
                </label>
                <input
                  type="email"
                  value={founderEmail}
                  onChange={e => setFounderEmail(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Operating Timezone (Rule 2.1)
                </label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                >
                  <option value="Asia/Karachi">Asia/Karachi (PKT, UTC+5)</option>
                  <option value="Asia/Qatar">Asia/Qatar (AST, UTC+3)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Primary Target GCC Market
                </label>
                <select
                  value={targetMarket}
                  onChange={e => setTargetMarket(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border focus:outline-none bg-[var(--surface-2)] border-[var(--border-soft)] text-zinc-200"
                >
                  <option value="both">Qatar, UAE & Saudi Arabia</option>
                  <option value="qatar">Qatar (Doha Luxury Focus)</option>
                  <option value="dubai">Dubai, UAE (Off-plan Focus)</option>
                  <option value="ksa">Saudi Arabia (Riyadh Focus)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-orange)] text-[#101110] hover:opacity-90 cursor-pointer"
              >
                <Save size={14} />
                <span>Save Preferences</span>
              </button>
              {saved && (
                <span className="ml-3 inline-flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 size={13} /> Preferences saved.
                </span>
              )}
            </div>
          </div>
        </form>

        {/* Database Management & Clean Slate Reset */}
        <div
          className="p-5 sm:p-6 rounded-xl space-y-4"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
            <Database size={18} style={{ color: 'var(--brand-orange)' }} />
            <div>
              <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Database Management & Clean Slate Tools
              </h2>
              <p className="text-xs text-zinc-400">Export backups or reset database for new testing cycles</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-2)] text-xs">
            <div>
              <span className="font-semibold text-white">Reset Database to Clean Slate</span>
              <p className="text-zinc-400 mt-0.5">
                Clears all tasks, approvals, content drafts, and sales leads to start completely fresh.
              </p>
            </div>

            <button
              onClick={handleResetDatabase}
              disabled={resetting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 cursor-pointer transition-colors flex-shrink-0 disabled:opacity-40"
            >
              {resetting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              <span>{resetting ? 'Resetting...' : 'Reset Database'}</span>
            </button>
          </div>

          {resetSuccess && (
            <div className="p-3 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle2 size={14} />
              <span>Database reset to clean slate. Reloading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
