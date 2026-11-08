# Authronic Command Center — Architectural Decision Record (ADR)

## ADR-001: Separation of Command Center from Public Website
- **Status:** Accepted
- **Context:** Authronic has a public marketing website (`authronic-website`). The founder requires a private, authenticated internal dashboard to manage content operations, sales CRM, AI agents, and workflows.
- **Decision:** Build `authronic-command-center` as an independent Next.js application designed to run on `dashboard.authronic.com`, without modifying or deploying to the marketing site repository. Brand assets, fonts, and design tokens are replicated to ensure consistent brand identity.

## ADR-002: Unified Brand Color Token Resolution
- **Status:** Accepted
- **Context:** The public website exhibits slight color discrepancies between its global CSS variables and homepage style definitions (e.g. orange hues `#F78F1E` vs `#FF981F`, dark backgrounds `#101110` vs `#0B0B0B`).
- **Decision:** Harmonize into semantic design tokens:
  - `--brand-orange`: `#F78F1E` (primary brand accent)
  - `--brand-orange-bright`: `#FF981F` (hover / interactive highlights)
  - `--brand-orange-deep`: `#E95D24` (deep accent / active indicators)
  - `--bg-base`: `#101110` (main operational page background)
  - `--bg-dark`: `#0B0B0B` (card backing / modal background)
  - `--bg-shell`: `#161616` (sidebar & topbar header)
  - `--surface-1`: `#1A1B19`, `--surface-2`: `#22231F`, `--surface-3`: `#2A2B27`

## ADR-003: Authentication Architecture for v1 (Solo Founder)
- **Status:** Accepted
- **Context:** The MVP serves a solo founder/admin. Third-party OAuth or external auth providers introduce external dependencies before local testing is possible.
- **Decision:** Implement Auth.js / NextAuth Credentials provider using server-side environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET`). Route protection is enforced via Next.js middleware matching all internal routes. Unauthorized requests are redirected to `/login`.

## ADR-004: Honest State Display and Disconnected Integrations
- **Status:** Accepted
- **Context:** Live credentials for n8n, Gemini, HeyGen, Gmail, and social publishing platforms are not yet connected or may be provisioned incrementally.
- **Decision:** The dashboard strictly refuses to simulate fake success or fake live connections. Integrations show `Not connected` badges until credentials exist. All sample data is explicitly badged with `Demo environment` to maintain operational trust.
