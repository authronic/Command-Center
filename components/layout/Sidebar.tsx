'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  ThumbsUp,
  FileText,
  Calendar,
  Users,
  Bot,
  Activity,
  FolderOpen,
  BarChart2,
  Plug,
  Settings,
} from 'lucide-react'

export const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'My Tasks', href: '/tasks', icon: CheckSquare },
      { label: 'Approvals', href: '/approvals', icon: ThumbsUp },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Content Studio', href: '/content', icon: FileText },
      { label: 'Content Calendar', href: '/content/calendar', icon: Calendar },
      { label: 'Sales CRM', href: '/sales', icon: Users },
      { label: 'AI Agents', href: '/agents', icon: Bot },
      { label: 'Workflow Runs', href: '/runs', icon: Activity },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Files & Assets', href: '/assets', icon: FolderOpen },
      { label: 'Analytics & Costs', href: '/analytics', icon: BarChart2 },
      { label: 'Integrations', href: '/integrations', icon: Plug },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden lg:flex flex-col flex-shrink-0 h-full overflow-y-auto select-none"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-shell)',
        borderRight: '1px solid var(--border-soft)',
      }}
    >
      {/* Brand Header */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        <Link href="/dashboard" className="flex items-center gap-2.5 mb-1 group">
          <div className="w-5 h-5 relative flex-shrink-0">
            <Image
              src="/brand/icon.png"
              alt="Authronic"
              fill
              sizes="20px"
              className="object-contain"
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
          <span className="font-semibold text-sm tracking-tight group-hover:text-[var(--brand-orange)] transition-colors" style={{ color: 'var(--text-primary)' }}>
            AUTHRONIC
          </span>
        </Link>
        <span className="text-[10px] font-medium tracking-[0.18em] block mt-0.5" style={{ color: 'var(--text-muted)' }}>
          COMMAND CENTER
        </span>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 space-y-6" aria-label="Main sidebar navigation">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p
              className="px-3 mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                      style={
                        isActive
                          ? {
                              background: 'rgba(247, 143, 30, 0.12)',
                              color: 'var(--brand-orange)',
                              fontWeight: 600,
                            }
                          : {
                              color: 'var(--text-secondary)',
                            }
                      }
                    >
                      <Icon
                        size={16}
                        className="flex-shrink-0 transition-transform group-hover:scale-105"
                        style={isActive ? { color: 'var(--brand-orange)' } : { color: 'var(--text-muted)' }}
                      />
                      <span>{label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / Demo Environment Status */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
        <Link
          href="/integrations"
          className="flex items-center justify-between text-xs p-2 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: 'var(--text-muted)' }}
          title="Inspect integration status"
        >
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span style={{ color: 'var(--text-secondary)' }}>Demo Environment</span>
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-2)', color: 'var(--brand-orange)' }}>
            v1.0
          </span>
        </Link>
      </div>
    </aside>
  )
}
