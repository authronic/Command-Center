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
} from 'lucide-react'

export default function SettingsPage() {
  const [founderName, setFounderName] = useState('Authronic Founder')
  const [founderEmail, setFounderEmail] = useState('admin@authronic.com')
  const [timezone, setTimezone] = useState('Asia/Karachi')
  const [targetMarket, setTargetMarket] = useState('both')
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-[1480px] mx-auto space-y-6">
      {/* Header */}
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
          Settings & Operational Preferences
        </h1>
        <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          Configure founder profile, timezone defaults, target GCC markets, and security boundaries.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {/* Founder Profile Card */}
        <div
          className="p-5 sm:p-6 rounded-xl space-y-4"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
            <User size={18} style={{ color: 'var(--brand-orange)' }} />
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Solo Founder Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                Display Name
              </label>
              <input
                type="text"
                value={founderName}
                onChange={e => setFounderName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg text-xs outline-none"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-soft)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                Founder Notification Email
              </label>
              <input
                type="email"
                value={founderEmail}
                onChange={e => setFounderEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-lg text-xs outline-none"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-soft)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Timezone & Regional Localization */}
        <div
          className="p-5 sm:p-6 rounded-xl space-y-4"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
            <Globe size={18} style={{ color: 'var(--brand-orange)' }} />
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Regional Localization & Timezones
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                Founder Base Timezone (Default)
              </label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full h-10 px-3 rounded-lg text-xs outline-none"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-soft)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="Asia/Karachi">Asia/Karachi (PKT, UTC+5) — Current Default</option>
                <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
                <option value="Asia/Qatar">Asia/Qatar (AST, UTC+3)</option>
                <option value="UTC">UTC (Universal Coordinated Time)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                Primary Target Market Testing
              </label>
              <select
                value={targetMarket}
                onChange={e => setTargetMarket(e.target.value)}
                className="w-full h-10 px-3 rounded-lg text-xs outline-none"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-soft)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="both">Both Doha, Qatar & Dubai, UAE</option>
                <option value="qatar">Doha, Qatar (West Bay / Pearl focus)</option>
                <option value="dubai">Dubai, UAE (Off-plan / Agency focus)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div
          className="p-5 sm:p-6 rounded-xl space-y-4"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
            <Lock size={18} style={{ color: 'var(--brand-orange)' }} />
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Security & Environment Mode
            </h2>
          </div>

          <div className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
              <div>
                <p className="font-semibold text-white">Execution Environment</p>
                <p style={{ color: 'var(--text-muted)' }}>Local Development & Sandbox Verification</p>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
              <div>
                <p className="font-semibold text-white">Rule 6: Mandatory Human Approval</p>
                <p style={{ color: 'var(--text-muted)' }}>No cold messages or public publishing without human sign-off</p>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                ENFORCED
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ background: 'var(--brand-orange)', color: '#101110' }}
          >
            <Save size={14} />
            <span>Save Preferences</span>
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 animate-fadeIn">
              <CheckCircle2 size={13} /> Preferences saved locally.
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
