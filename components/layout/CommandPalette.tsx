'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
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
  ArrowRight,
  X
} from 'lucide-react'

interface CommandItem {
  id: string
  title: string
  category: 'Navigation' | 'Actions' | 'Operations'
  href: string
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  description?: string
}

const commandItems: CommandItem[] = [
  { id: 'dash', title: 'Dashboard', category: 'Navigation', href: '/dashboard', icon: LayoutDashboard, description: 'Operations overview & KPIs' },
  { id: 'tasks', title: 'My Tasks', category: 'Navigation', href: '/tasks', icon: CheckSquare, description: 'Personal task queue' },
  { id: 'approvals', title: 'Approvals', category: 'Navigation', href: '/approvals', icon: ThumbsUp, description: '2 pending reviews' },
  { id: 'content', title: 'Content Studio', category: 'Navigation', href: '/content', icon: FileText, description: '5-topic research & draft pipeline' },
  { id: 'calendar', title: 'Content Calendar', category: 'Navigation', href: '/content/calendar', icon: Calendar, description: 'Scheduled publications' },
  { id: 'sales', title: 'Sales CRM', category: 'Navigation', href: '/sales', icon: Users, description: 'GCC market prospects (Doha & Dubai)' },
  { id: 'agents', title: 'AI Agents', category: 'Navigation', href: '/agents', icon: Bot, description: '8 logical agent definitions' },
  { id: 'runs', title: 'Workflow Runs', category: 'Navigation', href: '/runs', icon: Activity, description: 'n8n run history & errors' },
  { id: 'assets', title: 'Files & Assets', category: 'Navigation', href: '/assets', icon: FolderOpen, description: 'Media storage & assets' },
  { id: 'analytics', title: 'Analytics & Costs', category: 'Navigation', href: '/analytics', icon: BarChart2, description: 'Estimated API spend & metrics' },
  { id: 'integrations', title: 'Integrations', category: 'Navigation', href: '/integrations', icon: Plug, description: 'Connected provider status' },
  { id: 'settings', title: 'Settings', category: 'Navigation', href: '/settings', icon: Settings, description: 'Founder profile & preferences' },
  { id: 'act-approval', title: 'Review: Qatar CRM Guide Post Draft', category: 'Actions', href: '/approvals', icon: ThumbsUp, description: 'Action required' },
  { id: 'act-run', title: 'Inspect Failed Run AUTH-C01', category: 'Actions', href: '/runs', icon: Activity, description: 'Intake format error' },
  { id: 'act-prospect', title: 'View Example Brokerage A Follow-up', category: 'Actions', href: '/sales', icon: Users, description: 'Discovery call due' },
]

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.trim() === ''
    ? commandItems
    : commandItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
      )

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length))
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault()
        const target = filtered[selectedIndex]
        onClose()
        router.push(target.href)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filtered, selectedIndex, router, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick navigation and commands"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl overflow-hidden shadow-2xl transition-all"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-strong)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input bar */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: '1px solid var(--border-soft)' }}
        >
          <Search size={18} style={{ color: 'var(--brand-orange)' }} className="flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Type a destination, task, or action... (Esc to close)"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close command palette"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              No matches found for &quot;{query}&quot;
            </div>
          ) : (
            <ul className="space-y-1">
              {filtered.map((item, index) => {
                const isSelected = index === selectedIndex
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        router.push(item.href)
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors"
                      style={{
                        background: isSelected ? 'rgba(247, 143, 30, 0.12)' : 'transparent',
                        color: isSelected ? 'var(--brand-orange)' : 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="p-1.5 rounded-md flex-shrink-0"
                          style={{
                            background: isSelected ? 'rgba(247, 143, 30, 0.2)' : 'var(--surface-2)',
                            color: isSelected ? 'var(--brand-orange)' : 'var(--text-secondary)',
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          {item.description && (
                            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded font-mono ml-2 flex-shrink-0"
                        style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                        {item.category}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          className="px-4 py-2 text-xs flex items-center justify-between"
          style={{
            background: 'var(--bg-shell)',
            borderTop: '1px solid var(--border-soft)',
            color: 'var(--text-muted)',
          }}
        >
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="font-medium" style={{ color: 'var(--brand-orange)' }}>Authronic Quick Search</span>
        </div>
      </div>
    </div>
  )
}
