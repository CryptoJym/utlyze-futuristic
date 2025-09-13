## Summary

Describe the change and which pages/flows are affected.

## Screenshots (if UI)

Add before/after or a brief note on visual changes.

## CI / QA

- [ ] Accessibility: pa11y-ci passes for all URLs (see PR comment and artifact)
- [ ] Lighthouse: No major regressions on perf/SEO/best-practices (check artifacts)
- [ ] E2E: `npm run test:e2e` passes locally for impacted flows

## Use Case Pages (if applicable)

- [ ] Added/updated page(s) under `/use-cases/*` with site theme
- [ ] JSON-LD includes `FAQPage` and `Service`
- [ ] CTAs use `.cta-button` / `.schedule-button` (tracks in `app.js`)
- [ ] Pricing pulled dynamically from `assets/data/tiers.json` (no hardcoded amounts)
- [ ] `sitemap.xml` updated with new URLs and correct canonicals

## Redirects (if applicable)

- [ ] Legacy `/resources/case-studies/*` URLs map 308 → `/use-cases/*` (see `vercel.json`)

## Checklist

- [ ] I’ve tested locally with `python3 -m http.server` and spot-checked key pages
- [ ] I’ve considered reduced-motion and mobile accessibility
- [ ] I’ve updated docs (README or page notes) if needed

