# Utlyze — Companies Gallery

A simple, static gallery at `/companies` showcasing ventures (with detail pages at `/companies/[slug]/`), deployed via Vercel. Content is managed by `companies/data.json`. Optional: Gamma Generate API enriches each company with a one‑pager PDF and OG image during CI.

## Live URLs
- Gallery: `/companies`
- Detail: `/companies/[slug]/` (e.g., `/companies/vuplicity/`)

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

## Notes & limits
- Gamma is beta and rate‑limited (e.g., 50 generations/month per user, subject to change)
- We only generate assets when the sync workflow runs; assets are reused in subsequent deploys
- If you prefer fully static, you can skip Gamma and just maintain `companies/data.json`
