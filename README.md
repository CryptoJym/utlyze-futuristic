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

## QA & Launch Handoff

Status Summary
- All happy‑path flows pass on Desktop, Tablet, Mobile.
- No console errors across: Home, ROI (/roi/), Contact (/contact/), Studio (/studio/).
- Mobile hamburger overlay fixed: menu opens above content and locks background scroll.

How To Run E2E
- Install dependencies: `npm install`
- Run tests: `npm run test:e2e`
- Config: `e2e/playwright.config.ts` (serves site on `http://localhost:3010`)
- Specs: `e2e/tests/`
  - `happy-home.spec.js` (nav, ROI CTA)
  - `happy-roi.spec.js` (calculator submit/results)
  - `happy-contact.spec.js` (form submit success)
  - `happy-studio.spec.js` (idea submit success)

Manual QA Checklist (quick)
- Mobile nav: toggle hamburger, tap Studio/Pricing/Contact; Esc closes menu.
- ROI: enter spend, click "Get my estimate" → results visible.
- Contact: submit with required fields → success message; verify honeypot hidden.
- Studio: submit idea with valid inputs → success message.

Launch Checklist
- Redirects/canonicals: Verify key pages resolve and canonicals present where intended (pricing ↔ roi as needed).
- Monitoring: Enable uptime + client error tracking (e.g., Sentry); Supabase logs for form inserts.
- Rollback: Host is static; roll back via prior artifact or `git revert` and redeploy.

Branch & Ownership
- Branch: `feat/qa-cross-device-happypaths`
- Artifacts: `e2e/` suite, nav overlay fix in `style.css` + `app.js`, ROI calc/client in `roi/`
- Handoff: Agent L (QA & Launch) complete. Ready for owner sign‑off and deploy.

## Handoff — Status & Next Steps (2025‑09‑05)

- Branch: `feat/bug-review-fixes`
- Latest commit: aligns contact form with Supabase (SDK + client init), adds `contact_submissions` table + RLS to `supabase-setup.sql`, fixes canonicals (ROI/pricing), sets absolute sitemap in `robots.txt`, adds `/about/` and `/resources/` stubs, routes missing resource links to `/contact/` to avoid 404s.

What’s done
- Analytics/SEO: JSON‑LD on home/agents/pricing, sitemap.xml, robots.txt; CTA tracking extended in `app.js` to cover primary/secondary/tier CTA buttons.
- Contact form: now inserts into `public.contact_submissions` under RLS; docs updated via schema changes.
- 404s removed: `/about/` and `/resources/` stub pages added; sitemap updated.

Found issues to fix next
- Agents CTA target: “Schedule Demo” currently links to `#schedule-demo` (no‑op). Change to `/contact/` or add an actual section.
- ROI embed placeholder: Replace `VIDEO_ID` in the YouTube iframe or hide the block until ready.
- Tier pricing mismatch: Align `assets/data/tiers.json` with UI (e.g., TierB $2,600 vs 2200; TierC $6,000+ vs 3300). Prefer rendering pricing from JSON to prevent drift.
- CTA tracking coverage: Add `.schedule-button` and any remaining CTA classes in `app.js` to ensure logging from Contact and other pages.
- Dead ROI report code: `roi/app.js` references variables/IDs not present; remove or wire properly behind a feature flag.
- Canonicals: Consider absolute URLs for ROI/Pricing (`https://utlyze.com/...`).

How to continue
- Implement the five fixes above (small, surgical patches). Commit each with conventional messages, e.g.,
  - `fix(agents): point demo CTA to /contact/`
  - `fix(roi): replace VIDEO_ID or hide video block`
  - `chore(pricing): sync UI with tiers.json and render from data`
  - `chore(analytics): extend trackClick to .schedule-button`
  - `chore(roi): remove unused detailed report block`
- Push `feat/bug-review-fixes` and open a PR; add the PR checklist: JSON‑LD valid, CTAs tracked, no 404s, sitemap includes new pages.

Quick validation
- Open `/agents/` and verify the Demo CTA navigates to `/contact/` (after fix).
- Submit Contact and ROI forms once; check rows in Supabase `contact_submissions` and `roi_leads`.
- Run E2E locally: `npm install && npm run test:e2e` (ensures no console errors).

## Notes & limits
- Gamma is beta and rate‑limited (e.g., 50 generations/month per user, subject to change)
- We only generate assets when the sync workflow runs; assets are reused in subsequent deploys
- If you prefer fully static, you can skip Gamma and just maintain `companies/data.json`
