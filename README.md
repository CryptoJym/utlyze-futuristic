# Utlyze — Sites

This repo includes:
- A simple, static gallery at `/companies` showcasing ventures (with detail pages at `/companies/[slug]/`), deployed via Vercel. Content is managed by `companies/data.json`.
- A dedicated ROI landing page at `/roi/` with a calculator and lead capture stored in Supabase (`roi_leads`).

## Live URLs
- Gallery: `/companies`
- Detail: `/companies/[slug]/` (e.g., `/companies/vuplicity/`)
- ROI Calculator & Funnel: `/roi/`

## ROI Landing Page
- Path: `roi/index.html` (logic in `roi/app.js`)
- Captures calculator inputs and results along with UTM/referrer metadata
- Inserts into Supabase table `public.roi_leads` (see `SUPABASE_SETUP.md`)

## How content works
- Source file: `companies/data.json` (array of companies)
- Required fields per company:
  - `name`, `slug`, `tagline`, `description`, `industry`, `stage`, `websiteUrl`, `demoUrl`
- Optional fields used in UI:
  - `achievements` (string array), `founded`, `teamSize`, `location`, `color`, `logo`
- Optional fields written by CI when Gamma is enabled:
  - `onePagerPdfUrl`: link to generated PDF
  - `ogImage`: generated cover/OG image URL

## Add or edit a company
1) Edit `companies/data.json` and add/update an entry.
2) Commit and push to `main` → Vercel redeploys.

## Gamma enrichment (optional)
- CI tries to generate a one‑pager PDF and cover image for each company via the Gamma Generate API, then injects links/meta into detail pages. You can prevent CI from overwriting a hand-authored detail page by setting `SKIP_WRITE_SLUGS` (comma‑separated slugs) in the workflow env.
- Docs: https://developers.gamma.app/docs/getting-started (beta; limits may change)

### Setup
Add repo secret:
- `GAMMA_API_KEY`: Your Gamma API key (Pro plan; beta limits apply)

Optional:
- `GAMMA_THEME`: A Gamma theme identifier (string) to keep branding consistent

### Run
- GitHub → Actions → “Sync Companies” → Run workflow
- The workflow:
  - Reads `companies/data.json`
  - Calls Gamma (if `GAMMA_API_KEY` is set) to generate a one‑pager + OG image
  - Writes `companies/data.json` (enriched) and regenerates detail pages
  - Commits and pushes changes to `main`

## CI details
- Workflow: `.github/workflows/sync-companies.yml` (with `permissions: contents: write` to allow bot commits)
- Script: `scripts/sync-companies.mjs` (Node 20; uses built‑in `fetch`)
- Safety: If Gamma fails or rate limits are hit, the script logs a warning and continues without blocking deploys

## Local preview
- Open `index.html` for the homepage or `companies/index.html` for the gallery in a static server (e.g., VS Code Live Server or `npx serve`)
- Note: The gallery renders cards client‑side from `companies/data.json`

## QA & Launch (Agent L)

Happy‑path E2E tests are implemented with Playwright and run against a local static server.

- Install: `npm install`
- Run: `npm run test:e2e` (config at `e2e/playwright.config.ts`)
- Coverage:
  - Home navigation (header, ROI CTA)
  - ROI calculator submit (`/roi/`) with client‑side calc and result view
  - Contact form submit (`/contact/`) with success message
  - Venture Studio submit (`/studio/`) with success confirmation
- Devices: Desktop Chrome (1280x800), Tablet (820x1180), Mobile (Pixel 5)
- Console: Tests assert zero console errors and no page exceptions

Launch Checklist

- Redirects/Canonicals: Verified key paths resolve (`/`, `/roi/`, `/contact/`, `/studio/`). Canonical tags: ROI self‑canonical; pricing page canonical to be verified when `/pricing/` is live.
- Monitoring: Recommend enabling uptime checks (e.g., Pingdom/Healthchecks) and client‑side error capture (e.g., Sentry). Supabase logs present for form inserts.
- Rollback: Static deploys are atomic. If issues arise, redeploy previous artifact or revert to the prior commit on the hosting provider.
- QA Status: All happy‑paths green across mobile/tablet/desktop; no console errors observed during tests.

## MCP integration (planned)
We are adding a new MCP integration for richer automation and review tooling.
- Owner: @omnara
- Scope: connect the gallery to MCP for scripted checks (UX lint, data validation), and for fast preview actions.
- Next steps:
  - Define MCP endpoints and auth
  - Wire a minimal client in `/companies/app.js` (feature‑flagged)
  - Add a README subsection with usage once landed

## Notes & limits
- Gamma is beta and rate‑limited (e.g., 50 generations/month per user, subject to change)
- We only generate assets when the sync workflow runs; assets are reused in subsequent deploys
- If you prefer fully static, you can skip Gamma and just maintain `companies/data.json`
