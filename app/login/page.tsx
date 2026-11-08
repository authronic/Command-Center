'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, LogIn, Lock, ShieldCheck, Key } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        username: username.trim(),
        password: password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError('Invalid username or password. Please verify your credentials.')
      }
    } catch {
      setError('An error occurred during authentication. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  function fillDemoCredentials() {
    setUsername('admin')
    setPassword('authronic2026')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-dark)' }}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] opacity-10 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(ellipse at center, var(--brand-orange) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative w-full max-w-[420px] mx-auto z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="mb-4 relative w-48 h-10">
            <Image
              src="/brand/wordmark.webp"
              alt="Authronic"
              fill
              priority
              sizes="192px"
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-[0.16em] uppercase"
            style={{ background: 'rgba(247, 143, 30, 0.1)', color: 'var(--brand-orange)', border: '1px solid rgba(247, 143, 30, 0.2)' }}>
            <Lock size={10} />
            Command Center
          </div>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-6 sm:p-8 shadow-2xl"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-soft)',
          }}
        >
          <div className="mb-6">
            <h1
              className="text-xl sm:text-2xl font-semibold mb-1"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.025em' }}
            >
              Sign in to Operations
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
              Private access for Authronic leadership & operations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username-input"
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Username
              </label>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                autoFocus
                placeholder="Enter username"
                className="w-full h-11 rounded-lg px-4 text-sm transition-all outline-none"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-soft)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--brand-orange)'
                  e.target.style.boxShadow = '0 0 0 2px rgba(247, 143, 30, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-soft)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password-input"
                  className="block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Password
                </label>
              </div>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder="••••••••••••"
                className="w-full h-11 rounded-lg px-4 text-sm transition-all outline-none"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-soft)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--brand-orange)'
                  e.target.style.boxShadow = '0 0 0 2px rgba(247, 143, 30, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-soft)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 rounded-lg text-xs flex items-center gap-2"
                style={{
                  background: 'rgba(248, 113, 113, 0.1)',
                  border: '1px solid rgba(248, 113, 113, 0.25)',
                  color: '#F87171',
                }}
              >
                <span className="font-semibold">Error:</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
              style={{
                background: 'var(--brand-orange)',
                color: '#101110',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo helper */}
          <div
            className="mt-6 pt-4 text-center rounded-lg p-3"
            style={{
              background: 'var(--surface-2)',
              border: '1px dashed var(--border-soft)',
            }}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                <Key size={13} style={{ color: 'var(--brand-orange)' }} />
                Demo Credentials
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs font-semibold hover:underline"
                style={{ color: 'var(--brand-orange)' }}
              >
                Auto-fill
              </button>
            </div>
            <p className="text-[11px] font-mono text-left" style={{ color: 'var(--text-secondary)' }}>
              User: <span style={{ color: 'var(--text-primary)' }}>admin</span> · Pass: <span style={{ color: 'var(--text-primary)' }}>authronic2026</span>
            </p>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs" style={{ color: 'var(--text-muted)' }}>
          <ShieldCheck size={14} style={{ color: 'var(--brand-orange)' }} />
          <span>Encrypted Session · Solo Founder Operations v1.0</span>
        </div>
      </div>
    </div>
  )
}
