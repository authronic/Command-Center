# Authronic Command Center — Implementation Plan

**Date:** 8 November 2026  
**Status:** In Progress — Phase 1  
**Project:** Authronic Command Center (Private Operations Dashboard)  
**Target Environment:** Local Node.js v24.21.0 / Windows 11  

---

## 1. Environment & Architecture Findings

1. **Repository Structure:**
   - Public Website: located at `C:\Users\sajja\OneDrive\Desktop\Startup AI Business\Authronic Startup\Website\authronic-website` (Next.js 14.2.15, Tailwind CSS 3.4.14, Lucide React).
   - Brand Assets: Outfit variable font (`outfit-latin.woff2`), wordmark (`wordmark.webp`), logo (`logo.png`), icon (`icon.png`), and hero spark (`hero-spark.webp`) have been copied into `authronic-command-center/public/`.
   - Command Center App: located at `authronic-command-center`, scaffolded with Next.js App Router.
   
2. **Current Constraints & Missing Dependencies:**
   - Dependencies needed: `next-auth` (Auth.js v5 for Next App Router) and `lucide-react` (brand-consistent icons).
   - Brand palette aligned with website:
     - Base Dark: `#101110`, Darkest Shell: `#0B0B0B`, Sidebar/Header: `#161616`
     - Brand Orange Accent: `#F78F1E` / `#FF981F` / `#E95D24`
     - Text: `#F3F1ED` (primary), `#BABBB5` (secondary), `#8E928C` (muted)
     - Borders: `rgba(255, 255, 255, 0.09)` (soft), `rgba(255, 255, 255, 0.18)` (strong)
     - Focus Ring: `#FFB35C`
   - External Credentials: n8n, Gemini API, HeyGen, Gmail, Buffer/publishing are currently disconnected. The application must display honest `Not connected` statuses and provide a clear demo sandbox mode.

---

## 2. Phased Roadmap

### Phase 1 — Functional Shell, Brand System & Authentication (CURRENT)
- [x] Brand asset verification (Outfit font, wordmark, logo, icon, spark).
- [ ] Install missing core packages (`next-auth`, `lucide-react`, type definitions).
- [ ] Implement responsive shell:
  - Collapsible desktop sidebar (248px) with categorized navigation.
  - Mobile drawer/overlay with focus trapping and accessible hamburger toggle.
  - Sticky Topbar with breadcrumb, PKT date indicator, search trigger, notification indicator, and sign-out button.
  - Accessible keyboard navigation, WCAG 2.2 AA compliant contrast, no horizontal overflow down to 320px.
- [ ] Secure owner authentication & session handling:
  - Credentials provider via Auth.js / NextAuth with server-side validation against `.env.local`.
  - Protected route middleware (`/dashboard`, `/tasks`, `/approvals`, etc. redirecting to `/login` when unauthorized).
  - Secure sign-in page with Authronic wordmark, error alerts, and loading spinner.
  - Functional sign-out workflow with session invalidation.
- [ ] Working demo-mode banner across all views.
- [ ] Unit & integration verification for shell and auth flows.

### Phase 2 — Database-backed MVP Operations (Tasks, Approvals, Runs, Agent Registry)
- PostgreSQL / SQLite / local DB migrations.
- Personal task management (CRUD, priority, status, due dates).
- Approvals queue with audit trail and version tracking.
- System run history and agent registry with honest status badges.

### Phase 3 — Content Studio MVP
- 5-topic research email intake (structured JSON manual import + parser).
- Topic scoring and allocation (2 static, 1 carousel, 1 video, 1 skip).
- Draft state machine and format-specific review drawers.
- Content calendar with internal scheduling states.

### Phase 4 — Sales CRM MVP
- GCC market prospect pipeline (Doha & Dubai real estate focus).
- Company records, activities, next actions, and hypothesis tracking.

### Phase 5 — n8n Integration & Operations Observability
- Server-side webhook receiver with HMAC signature verification.
- Idempotency and error monitoring.

### Phase 6 — Media & Publishing Integrations
- Branded slide renderer for carousels.
- Avatar video provider abstraction (HeyGen adapter).
- Publishing coordinator adapter.

### Phase 7 — Production Hardening & Deployment Checklist
- Security audit, secrets validation, deployment configuration for `dashboard.authronic.com`.
