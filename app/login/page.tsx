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
  const [googleLoading, setGoogleLoading] = useState(false)

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

  function handleGoogleSignIn() {
    setGoogleLoading(true)
    signIn('google', { callbackUrl: '/dashboard' })
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
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-[0.16em] uppercase"
            style={{
              background: 'rgba(247, 143, 30, 0.1)',
              color: 'var(--brand-orange)',
              border: '1px solid rgba(247, 143, 30, 0.2)',
            }}
          >
            <Lock size={10} />
            Command Center
          </div>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-soft)',
          }}
        >
          <div>
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

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full h-11 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all hover:bg-white/10 active:scale-[0.99] cursor-pointer disabled:opacity-60"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-soft)',
              color: 'var(--text-primary)',
            }}
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t" style={{ borderColor: 'var(--border-soft)' }} />
            <span
              className="flex-shrink mx-3 text-[10px] uppercase tracking-wider font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              or credentials
            </span>
            <div className="flex-grow border-t" style={{ borderColor: 'var(--border-soft)' }} />
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
              User: <span style={{ color: 'var(--text-primary)' }}>admin</span> · Pass:{' '}
              <span style={{ color: 'var(--text-primary)' }}>authronic2026</span>
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
