# Authronic Command Center

**Private AI Operations Dashboard for Authronic**  
**Version:** 1.0 (Phase 1 Delivered)  
**Target Hostname:** `dashboard.authronic.com`  

---

## 1. Overview

Authronic Command Center is a secure, private operations application designed for solo-founder business oversight. It acts as the operational brain coordinating:
- **Content Engine:** 5-topic daily research ingestion, scoring, format allocation (2 static, 1 carousel, 1 video, 1 skip), human-in-the-loop review queue, and scheduled distribution.
- **Sales Engine:** GCC market validation (real estate operations in Doha, Qatar & Dubai, UAE), prospect qualification, pain hypothesis tracking, and discovery notes.
- **Shared Operations:** Personal task queue, durable approval gates, workflow execution logs, provider health telemetry, and honest API spend tracking.

---

## 2. Phase 1 Implementation Summary

- **Scaffold & Brand Identity:** Built with Next.js 16 (App Router) and Tailwind CSS. Faithfully mirrors Authronic's brand language using the official variable font **Outfit**, official wordmark, fallback logos, and the near-black/warm orange design tokens (`#101110`, `#1A1B19`, `#22231F`, `#F78F1E`).
- **Authentication & Route Protection:** Full server-side session authentication with Auth.js / NextAuth v5. All internal routes (`/dashboard`, `/tasks`, `/approvals`, `/content`, `/sales`, `/agents`, `/runs`, `/assets`, `/analytics`, `/integrations`, `/settings`) are strictly protected. Unauthenticated visitors are automatically redirected to `/login`.
- **Responsive Shell & Mobile Navigation:**
  - Desktop (>=1024px): Fixed 256px branded sidebar with grouped navigation and live demo indicator.
  - Tablet & Mobile (<1024px): Touch-friendly Topbar with hamburger toggle opening an accessible, focus-trapped slide-out drawer.
  - Viewport certified down to 320px with zero horizontal page clipping.
- **Operational Features & Interactions:**
  - **Quick Command Palette (`Ctrl+K`):** Global instant search across all dashboard routes and quick operational actions.
  - **Notifications Menu:** Real dismissible operational alerts for pending post reviews, failed intake webhooks, and demo status.
  - **Clickable Dashboard KPIs:** Navigates directly to filtered views (`/runs`, `/approvals`, `/sales`).
  - **Action Required Lane:** Prioritized lane for pending decisions, failed intake runs, and scheduled follow-ups.
  - **Integrations Health:** Strict adherence to Rule 7 (Zero fake integrations). Unconnected external services (n8n, Gmail, Gemini, HeyGen, Publishing) are transparently labeled as `Not connected`.
  - **Demo Environment Mode:** Clear indicators and banners throughout the UI to ensure fixture data is never mistaken for live metrics.

---

## 3. Quick Start & Local Setup

### Prerequisites
- Node.js v20.9.0 or higher (v24.x tested and supported)
- npm v10 or higher

### Installation & Execution
```bash
# 1. Navigate to the project directory
cd authronic-command-center

# 2. Install dependencies
npm install

# 3. Configure environment variables (copy from template)
cp .env.example .env.local

# 4. Start the development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

### Default Demo Credentials (for local testing)
- **Username:** `admin`
- **Password:** `authronic2026`
*(Configured securely in `.env.local`)*

---

## 4. Key Scripts

```bash
# Run Next.js Turbopack development server on port 3000
npm run dev

# Production build and TypeScript validation
npm run build

# Start production server
npm start

# Automated End-to-End browser verification & multi-viewport screenshots
node scripts/capture-screenshots.cjs

# Verify server-side credentials and authentication callback
node scripts/test-auth.cjs
```

---

## 5. Verification & Test Evidence

Multi-viewport screenshots and verification artifacts are located in `docs/screenshots/`:
- `01-login-desktop-1440.png` — Desktop Login Screen (1440x900)
- `02-login-mobile-375.png` — Mobile Login Screen (375x812)
- `03-dashboard-desktop-1440.png` — Operations Dashboard (1440x900)
- `04-dashboard-tablet-768.png` — Tablet Dashboard Layout (768x1024)
- `05-dashboard-mobile-375.png` — Mobile Dashboard Layout (375x812)
- `06-mobile-drawer-open-375.png` — Mobile Navigation Drawer Open (375x812)
- `07-command-palette-1440.png` — Quick Command Palette (`Ctrl+K`)
- `08-notifications-menu-1440.png` — Operational Notifications Dropdown
- `09-approvals-desktop-1440.png` — Human-in-the-loop Approvals Queue
- `10-tasks-desktop-1440.png` — My Tasks Queue & Filters
- `11-integrations-desktop-1440.png` — Integration Health Matrix

---

## 6. Architecture & ADR References
- `docs/IMPLEMENTATION_PLAN.md`: Phased build plan and prerequisite checklist.
- `docs/DECISIONS.md`: Architectural Decision Records (ADRs) covering brand tokens, auth security, and honest integration states.
