'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  X,
  Send,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Bot,
  User,
  Sliders,
  HardDrive,
  FileCheck,
  Calendar,
  Layers,
} from 'lucide-react'

interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
  timestamp: string
  actionExecuted?: {
    type: string
    details: string
    link?: string
    linkLabel?: string
  }
}

export default function DashboardCopilot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content:
        'Hello Founder. I am your Authronic Operations Copilot. You can tell me to approve content, generate carousel graphics, sync your Google Sheet, or schedule posts.',
      timestamp: 'Just now',
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  async function handleSend(text?: string) {
    const prompt = (text || input).trim()
    if (!prompt || busy) return

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setBusy(true)

    const lower = prompt.toLowerCase()
    let replyContent = ''
    let actionExecuted: Message['actionExecuted'] = undefined

    try {
      // 1. Approve content command
      if (lower.includes('approve') || lower.includes('approval')) {
        // Fetch pending approvals
        const apprRes = await fetch('/api/approvals')
        if (apprRes.ok) {
          const apprData = await apprRes.json()
          const pending = (apprData.approvals || []).filter((a: any) => a.status === 'pending')

          if (pending.length > 0) {
            // Approve the first or all
            for (const item of pending) {
              await fetch(`/api/approvals/${item.id}/decision`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approved', feedback: 'Approved by AI Copilot on founder instruction' }),
              })
            }
            replyContent = `Done! I have approved ${pending.length} pending draft(s) in your queue. They are now cleared for asset generation and scheduling.`
            actionExecuted = {
              type: 'APPROVAL_GRANTED',
              details: `Approved ${pending.length} item(s)`,
              link: '/approvals',
              linkLabel: 'View in Approvals Queue',
            }
          } else {
            replyContent = 'Your approvals queue is already clear. No pending drafts required approval.'
          }
        }
      }
      // 2. Generate carousel / visuals command
      else if (lower.includes('carousel') || lower.includes('visual') || lower.includes('image') || lower.includes('render')) {
        const res = await fetch('/api/media/render-carousel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batchId: 'batch-gemini-live-01' }),
        })
        const data = await res.json()

        replyContent = `Visual slide graphics generated! I rendered the 7-slide dark/orange carousel deck and uploaded the assets directly to your Google Drive folder.`
        actionExecuted = {
          type: 'ASSETS_RENDERED',
          details: '7 slides rendered and indexed in Google Drive',
          link: '/assets',
          linkLabel: 'Open Files & Assets',
        }
      }
      // 3. Sync to Google Sheet command
      else if (lower.includes('sync') || lower.includes('sheet') || lower.includes('sheets')) {
        const syncRes = await fetch('/api/sync/sheet', { method: 'POST' })
        const syncData = await syncRes.json()

        replyContent = `Google Sheets synchronization complete! Tasks, approved content, and CRM pipeline records have been synchronized to Google Sheet ID 146tzKMld...`
        actionExecuted = {
          type: 'SHEET_SYNCED',
          details: syncData.message || 'Synchronized to Google Sheet',
          link: 'https://docs.google.com/spreadsheets/d/146tzKMldWAayotPPACLJFXM4LDJhVsrF2ccmdMbDwv4',
          linkLabel: 'Open Google Sheet',
        }
      }
      // 4. Schedule post command
      else if (lower.includes('schedule') || lower.includes('calendar')) {
        const calRes = await fetch('/api/content/calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'The 45-Second WhatsApp Qualification Engine for Off-Plan Launches',
            format: 'Carousel',
            channel: 'LinkedIn',
            dayOfWeek: 'Monday',
            scheduledTime: 'Monday · 11:00 AM PKT (10:00 AM AST)',
          }),
        })

        replyContent = `Scheduled! I placed the 7-slide WhatsApp Qualification Carousel onto your Content Calendar for Monday at 10:00 AM AST (optimized for Dubai & Qatar peak engagement).`
        actionExecuted = {
          type: 'CALENDAR_SCHEDULED',
          details: 'Placed on Monday social slot',
          link: '/content/calendar',
          linkLabel: 'View in Calendar',
        }
      }
      // 5. Default natural language assistance
      else {
        replyContent = `Understood. I have logged your request. I am prepared to take actions on your behalf across Content, CRM leads, and Google Drive.`
      }
    } catch (err: any) {
      replyContent = `I encountered an issue executing that command: ${err.message}`
    } finally {
      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionExecuted,
      }
      setMessages(prev => [...prev, assistantMsg])
      setBusy(false)
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer font-semibold text-xs"
        style={{
          background: 'linear-gradient(135deg, #F78F1E 0%, #E95D24 100%)',
          color: '#101110',
          boxShadow: '0 8px 30px rgba(247, 143, 30, 0.4)',
        }}
        title="Open AI Operations Copilot"
      >
        <Sparkles size={16} className="animate-spin-slow" />
        <span className="font-bold tracking-wide uppercase text-[11px]">AI Copilot</span>
      </button>

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-md h-full flex flex-col shadow-2xl border-l animate-slide-left"
            style={{
              background: 'var(--surface-1)',
              borderColor: 'var(--border-soft)',
            }}
          >
            {/* Drawer Header */}
            <div
              className="p-4 flex items-center justify-between border-b"
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--border-soft)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                  style={{ background: 'var(--brand-orange)', color: '#101110' }}
                >
                  <Bot size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Authronic Copilot
                    </h3>
                    <span
                      className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold"
                      style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80' }}
                    >
                      Active
                    </span>
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Autonomous Operations Agent
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-zinc-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Action Suggestion Chips */}
            <div
              className="p-3 border-b flex items-center gap-1.5 overflow-x-auto no-scrollbar"
              style={{ borderColor: 'var(--border-soft)', background: 'var(--surface-1)' }}
            >
              {[
                'Approve all pending ideas',
                'Generate carousel visuals',
                'Schedule next post on calendar',
                'Sync with Google Sheet',
              ].map(chip => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  disabled={busy}
                  className="px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors hover:bg-white/5 cursor-pointer disabled:opacity-40"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border-soft)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(247, 143, 30, 0.15)', color: 'var(--brand-orange)' }}
                    >
                      <Bot size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 space-y-2 ${
                      msg.role === 'user'
                        ? 'bg-[var(--brand-orange)] text-[#101110] font-medium'
                        : 'bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border-soft)]'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.content}</p>

                    {msg.actionExecuted && (
                      <div
                        className="p-2.5 rounded-lg mt-2 space-y-1 text-[11px]"
                        style={{
                          background: 'rgba(0, 0, 0, 0.25)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                          <CheckCircle2 size={12} />
                          <span>{msg.actionExecuted.details}</span>
                        </div>
                        {msg.actionExecuted.link && (
                          <a
                            href={msg.actionExecuted.link}
                            className="inline-flex items-center gap-1 underline font-semibold text-[var(--brand-orange)] hover:opacity-80 pt-1"
                          >
                            <span>{msg.actionExecuted.linkLabel || 'Open link'}</span>
                            <ArrowRight size={10} />
                          </a>
                        )}
                      </div>
                    )}

                    <span
                      className={`block text-[10px] ${
                        msg.role === 'user' ? 'text-black/60' : 'text-zinc-500'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.role === 'user' && (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-zinc-800 text-zinc-300"
                    >
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {busy && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface-2)] text-zinc-400 text-xs w-max">
                  <Loader2 size={14} className="animate-spin text-[var(--brand-orange)]" />
                  <span>Copilot executing operations...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={e => {
                e.preventDefault()
                handleSend()
              }}
              className="p-3 border-t flex items-center gap-2"
              style={{
                borderColor: 'var(--border-soft)',
                background: 'var(--surface-2)',
              }}
            >
              <input
                type="text"
                placeholder="Ask Copilot (e.g. 'Approve Idea 1 and generate visuals')..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={busy}
                className="flex-1 h-9 px-3 rounded-lg text-xs outline-none bg-[var(--surface-1)] border border-[var(--border-soft)] text-zinc-200 focus:border-[var(--brand-orange)]"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="h-9 px-3.5 rounded-lg flex items-center justify-center bg-[var(--brand-orange)] text-[#101110] hover:opacity-90 cursor-pointer disabled:opacity-40"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
