'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut, Search, ChevronRight, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import NotificationsMenu from './NotificationsMenu'
import CommandPalette from './CommandPalette'

const pageNames: Record<string, { title: string; section: string }> = {
  '/dashboard': { title: 'Dashboard', section: 'Overview' },
  '/tasks': { title: 'My Tasks', section: 'Overview' },
  '/approvals': { title: 'Approvals', section: 'Overview' },
  '/content': { title: 'Content Studio', section: 'Operations' },
  '/content/calendar': { title: 'Content Calendar', section: 'Operations' },
  '/sales': { title: 'Sales CRM', section: 'Operations' },
  '/agents': { title: 'AI Agents', section: 'Operations' },
  '/runs': { title: 'Workflow Runs', section: 'Operations' },
  '/assets': { title: 'Files & Assets', section: 'Management' },
  '/analytics': { title: 'Analytics & Costs', section: 'Management' },
  '/integrations': { title: 'Integrations', section: 'Management' },
  '/settings': { title: 'Settings', section: 'Management' },
}

interface TopbarProps {
  user?: { name?: string | null; email?: string | null }
  onOpenMobileMenu?: () => void
}

export default function Topbar({ user, onOpenMobileMenu }: TopbarProps) {
  const pathname = usePathname()
  const pageMeta = pageNames[pathname] ?? { title: 'Dashboard', section: 'Overview' }
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Karachi',
  })

  async function handleSignOut() {
    setIsSigningOut(true)
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <>
      <header
        className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 relative z-30"
        style={{
          height: 'var(--topbar-height)',
          background: 'var(--bg-shell)',
          borderBottom: '1px solid var(--border-soft)',
        }}
      >
        {/* Left: Hamburger menu (mobile/tablet) + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="hidden sm:inline font-medium" style={{ color: 'var(--text-muted)' }}>
              Authronic
            </span>
            <span className="hidden sm:inline text-muted">
              <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
            </span>
            <span className="hidden md:inline" style={{ color: 'var(--text-muted)' }}>
              {pageMeta.section}
            </span>
            <ChevronRight size={13} className="hidden md:inline" style={{ color: 'var(--text-muted)' }} />
            <span className="font-semibold truncate max-w-[150px] sm:max-w-none" style={{ color: 'var(--text-primary)' }}>
              {pageMeta.title}
            </span>
          </nav>
        </div>

        {/* Right: Date, Search, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span
            className="hidden lg:inline-block text-xs font-medium px-2.5 py-1 rounded-md"
            style={{ background: 'var(--surface-1)', color: 'var(--text-muted)' }}
          >
            {dateStr} · PKT
          </span>

          {/* Search Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            aria-label="Search and command palette (Ctrl+K)"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-soft)',
              color: 'var(--text-secondary)',
            }}
          >
            <Search size={14} style={{ color: 'var(--brand-orange)' }} />
            <span className="hidden sm:inline text-xs" style={{ color: 'var(--text-muted)' }}>Search...</span>
            <kbd
              className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
            >
              Ctrl K
            </kbd>
          </button>

          {/* Notifications Menu */}
          <NotificationsMenu />

          {/* User & Sign Out */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l" style={{ borderColor: 'var(--border-soft)' }}>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold leading-tight truncate max-w-[120px]" style={{ color: 'var(--text-primary)' }}>
                {user?.name ?? 'Admin'}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--brand-orange)' }}>
                Founder
              </span>
            </div>

            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all hover:bg-red-500/10 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
              style={{ color: 'var(--text-secondary)' }}
              title="Sign out of Command Center"
              aria-label="Sign out"
            >
              <LogOut size={15} />
              <span className="hidden xl:inline text-xs">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  )
}
