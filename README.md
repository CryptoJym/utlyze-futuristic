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

## Use Case detail template
- New use cases should be created from `use-cases/_template.html` to ensure consistent sections, CTAs, and a11y.
- Sections: Hero (title + one‑liner + optional stats) → Who it’s for → Field examples → Capabilities (≤5) → How it works (4 steps) → Integrations/KPIs → Rollout → Recommended tier (auto‑filled from `assets/data/tiers.json`) → FAQs (≤3) → CTA band.
- CTAs: `.btn btn--primary` (Get a Demo) and `.btn btn--outline` (Calculate ROI) with a 16px gap.
- Lists: Use `.feature-list` for single‑check bullets; avoid inline emoji.
- Steps: Use `<ol class="steps-list">` for numbered steps (styled circles).

## Accessibility checks
Pa11y CI targets are configured in `pa11y-ci.json` (WCAG2AA) to run against `http://localhost:4020`.

Quick run locally:
1) `npx http-server -p 4020 .` (from repo root)
2) In a second shell: `npx pa11y-ci`

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

Automation
- CI (e2e): `.github/workflows/e2e.yml` runs Playwright against a local static server.
- CI (quality): `.github/workflows/quality.yml` runs Lighthouse (perf/SEO/best-practices) and pa11y (WCAG2AA) against key routes.

## CI & QA Overview (added)

- Accessibility: `pa11y-ci` runs on core pages and all Use Case pages. See `pa11y-ci.json` and the “a11y” job in `.github/workflows/quality.yml`.
  - PRs receive an automatic comment summarizing pass/fail for each URL.
  - A JSON report is uploaded as a build artifact (`pa11y-report.json`).
- Lighthouse: Two passes run in `quality.yml` using `treosh/lighthouse-ci-action`:
  - Core pages: `/`, `/roi/`, `/pricing/`, `/agents/`, `/studio/`, `/contact/`.
  - Use Cases: `/use-cases/` and all 16 `/use-cases/*` pages.
- E2E: `npm run test:e2e` executes Playwright happy paths (desktop/tablet/mobile) via `.github/workflows/e2e.yml`.
- Redirects: `vercel.json` defines 308 redirects from legacy `/resources/case-studies/*` to the new `/use-cases/*` pages.

## PR Checklist (added)

Before requesting review, confirm:

- [ ] Accessibility: `pa11y-ci` passes for all URLs (see PR comment and artifact).
- [ ] Lighthouse: No critical regressions on perf/SEO/best-practices (see artifacts in the “quality” workflow).
- [ ] Redirects: Legacy `/resources/case-studies/*` paths 308 to the matching `/use-cases/*` (after deploy).
- [ ] Sitemap: New pages are listed in `sitemap.xml` with correct canonical links in `<head>`.
- [ ] JSON‑LD: Each Use Case includes FAQPage + Service schema.
- [ ] Pricing: Tier names and amounts load dynamically from `assets/data/tiers.json` (no hardcoded amounts).
- [ ] Tracking: `.schedule-button` / `.cta-button` present so click tracking in `app.js` continues to work.
- [ ] E2E: `npm run test:e2e` passes locally for changed flows.

## System Overview

- Architecture: Static HTML/CSS/JS with dynamic header/footer partials loaded by `app.js`.
- Forms: Client-side submissions to Supabase (anon insert) for contact and ROI funnel; ROI tests stub Supabase.
- Navigation: Shared partial at `/partials/header.html`; mobile overlay locks body scroll and toggles aria-expanded.
- Data: Pricing tiers at `assets/data/tiers.json` used by home/pricing.
- Tests: Playwright happy-path specs in `e2e/tests/` with reduced motion to decrease flakiness.
- CI: GitHub Actions for e2e and quality checks (Lighthouse + pa11y).

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
- Agents CTA fixed: Demo button on `/agents/` now links to `/contact/`; bottom contact link updated.
- ROI video: placeholder text shown; broken embed avoided.
- Tracking: `app.js` includes `.schedule-button` clicks.

Found issues to fix next
- Tier pricing render: Optionally render pricing from `assets/data/tiers.json` to prevent future drift (data now aligned: TierB 2600, TierC 6000+).
- Canonicals: Home and other pages may add canonicals if desired (pricing/roi set to absolute).
- Use‑case links: Consider changing label when routed to `/contact/` for clarity (current behavior avoids 404s).

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

## Leads Integration
- Uses Supabase public.lead_forms via Edge Function.
- Required env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
- Honeypots: hidden inputs named hpt and hp2 are included.
- Slack notifications: set SLACK_WEBHOOK_URL secret on the function.
- Analytics views available in DB: leads_daily, leads_by_campaign, leads_7d, leads_today_by_source.
