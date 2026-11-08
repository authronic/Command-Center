'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  X,
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

const navGroups = [
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

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 lg:hidden flex"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 transition-opacity"
        style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(3px)' }}
        onClick={onClose}
      />

      {/* Drawer content */}
      <div
        ref={drawerRef}
        className="relative flex-1 flex flex-col max-w-[280px] w-full h-full shadow-2xl z-10 overflow-y-auto"
        style={{
          background: 'var(--bg-shell)',
          borderRight: '1px solid var(--border-soft)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-soft)' }}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 relative flex-shrink-0">
                <Image
                  src="/brand/icon.png"
                  alt="Authronic"
                  fill
                  sizes="20px"
                  className="object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
              <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                AUTHRONIC
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-[0.15em] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              COMMAND CENTER
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-6" aria-label="Mobile navigation">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p
                className="px-3 mb-2 text-xs font-semibold tracking-[0.12em] uppercase"
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
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        style={
                          isActive
                            ? {
                                background: 'rgba(247, 143, 30, 0.12)',
                                color: 'var(--brand-orange)',
                              }
                            : {
                                color: 'var(--text-secondary)',
                              }
                        }
                      >
                        <Icon size={16} className="flex-shrink-0" />
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
          <p className="text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            Demo environment
          </p>
        </div>
      </div>
    </div>
  )
}
