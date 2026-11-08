'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Bell,
  AlertTriangle,
  FileCheck,
  Calendar,
  Info,
  Check,
  X,
  ExternalLink
} from 'lucide-react'

export interface NotificationItem {
  id: string
  title: string
  description: string
  type: 'approval' | 'failure' | 'task' | 'system'
  urgency: 'high' | 'normal' | 'low'
  time: string
  href: string
  read: boolean
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Review: Qatar CRM Guide post draft',
    description: 'Static post draft prepared from approved research batch. Awaiting human approval.',
    type: 'approval',
    urgency: 'high',
    time: '12m ago',
    href: '/approvals',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'AUTH-C01 Research intake failed',
    description: 'Topic intake failed with invalid source format. Retry available.',
    type: 'failure',
    urgency: 'high',
    time: '45m ago',
    href: '/runs',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Discovery follow-up: Example Brokerage A',
    description: 'Scheduled follow-up on pain point hypothesis due today.',
    type: 'task',
    urgency: 'normal',
    time: '2h ago',
    href: '/sales',
    read: false,
  },
  {
    id: 'notif-4',
    title: 'Demo Environment Active',
    description: 'Integrations are disconnected. Sample data is labeled.',
    type: 'system',
    urgency: 'low',
    time: 'System',
    href: '/integrations',
    read: false,
  },
]

export default function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const menuRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function dismiss(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  function getIcon(type: NotificationItem['type']) {
    switch (type) {
      case 'approval':
        return <FileCheck size={15} style={{ color: 'var(--brand-orange)' }} />
      case 'failure':
        return <AlertTriangle size={15} style={{ color: '#F87171' }} />
      case 'task':
        return <Calendar size={15} style={{ color: '#60A5FA' }} />
      default:
        return <Info size={15} style={{ color: '#9CA3AF' }} />
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative p-2 rounded-lg transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        style={{ color: 'var(--text-secondary)' }}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 flex h-2 w-2"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: 'var(--brand-orange)' }} />
            <span className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: 'var(--brand-orange)' }} />
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="region"
          aria-label="Notifications list"
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl z-50 overflow-hidden"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-strong)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid var(--border-soft)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  className="px-2 py-0.5 text-xs font-semibold rounded-full"
                  style={{ background: 'rgba(247, 143, 30, 0.15)', color: 'var(--brand-orange)' }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium hover:underline flex items-center gap-1"
                style={{ color: 'var(--text-muted)' }}
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y" style={{ borderColor: 'var(--border-soft)' }}>
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                You&apos;re all caught up — no notifications.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 transition-colors relative group"
                  style={{
                    background: n.read ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="p-1.5 rounded-md mt-0.5 flex-shrink-0"
                      style={{ background: 'var(--surface-2)' }}
                    >
                      {getIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <Link
                        href={n.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-xs font-semibold hover:underline truncate"
                        style={{ color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                      >
                        {n.title}
                      </Link>
                      <p className="text-xs line-clamp-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {n.description}
                      </p>
                      <span className="text-[10px] mt-1 inline-block" style={{ color: 'var(--text-muted)' }}>
                        {n.time}
                      </span>
                    </div>

                    <button
                      onClick={() => dismiss(n.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 rounded hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--text-muted)' }}
                      title="Dismiss"
                      aria-label="Dismiss notification"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2.5 text-center text-xs"
            style={{
              background: 'var(--bg-shell)',
              borderTop: '1px solid var(--border-soft)',
            }}
          >
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="font-medium hover:underline inline-flex items-center gap-1"
              style={{ color: 'var(--brand-orange)' }}
            >
              View operations overview <ExternalLink size={11} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
