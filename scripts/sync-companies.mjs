#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const NOTION_ENABLED = !!process.env.NOTION_API_KEY && !!process.env.NOTION_DATABASE_ID;
const GAMMA_ENABLED = !!process.env.GAMMA_API_KEY;

async function ensureDir(p){ await fs.mkdir(p, { recursive: true }); }

async function fetchNotionCompanies(){
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_DATABASE_ID;
  const rows = [];
  const url = `https://api.notion.com/v1/databases/${dbId}/query`;
  let hasMore = true; let startCursor = undefined;
  while(hasMore){
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ start_cursor: startCursor })
    });
    if(!res.ok){
      const t = await res.text();
      throw new Error(`Notion fetch failed: ${res.status} ${t}`);
    }
    const data = await res.json();
    rows.push(...data.results);
    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }
  const companies = rows.map(r => {
    const p = r.properties || {};
    const get = (name, def='') => p[name]?.rich_text?.[0]?.plain_text ?? p[name]?.title?.[0]?.plain_text ?? p[name]?.select?.name ?? p[name]?.url ?? def;
    const multi = (name) => Array.isArray(p[name]?.multi_select) ? p[name].multi_select.map(x=>x.name) : [];
    const files = (name) => Array.isArray(p[name]?.files) ? p[name].files.map(f=>f.external?.url || f.file?.url).filter(Boolean) : [];
    return {
      id: r.id,
      name: get('Name'),
      slug: get('Slug'),
      tagline: get('Tagline'),
      description: get('Description'),
      industry: get('Industry'),
      stage: get('Stage'),
      founded: Number(get('Founded', '')) || undefined,
      teamSize: Number(get('TeamSize', '')) || undefined,
      location: get('Location'),
      achievements: multi('Achievements'),
      demoUrl: get('PrimaryCTA'),
      websiteUrl: get('WebsiteURL'),
      logo: files('Logo')[0] ? 'logo' : undefined,
      heroImage: files('HeroImage')[0] ? 'hero' : undefined,
      featured: p['Featured']?.checkbox || false,
      publish: p['Publish']?.checkbox || false
    };
  }).filter(c => c.publish && c.name);
  return companies;
}

async function maybeGammaGenerate(company){
  if(!GAMMA_ENABLED) return company;
  try {
    const payload = {
      type: 'document',
      title: `${company.name} One-Pager`,
      prompt: `Create a concise, VC-ready one-pager for ${company.name}.\nTagline: ${company.tagline||''}\nIndustry: ${company.industry||''}\nStage: ${company.stage||''}\nOverview: ${company.description||''}\nHighlights: ${(company.achievements||[]).join(', ')}`,
      theme: process.env.GAMMA_THEME || 'utlyze-default',
      format: 'letter'
    };

    const genRes = await fetch('https://api.gamma.app/v0.2/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GAMMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if(!genRes.ok) throw new Error(`Gamma generate failed ${genRes.status}`);
    const gen = await genRes.json();
    const docId = gen.id || gen.documentId || gen.result?.id;

    if(docId){
      const pdfRes = await fetch(`https://api.gamma.app/v0.2/exports/${docId}?format=pdf`, {
        headers: { 'Authorization': `Bearer ${process.env.GAMMA_API_KEY}` }
      });
      if(pdfRes.ok){
        const pdfJson = await pdfRes.json();
        company.onePagerPdfUrl = pdfJson.url || pdfJson.downloadUrl;
      }

      const imgRes = await fetch(`https://api.gamma.app/v0.2/exports/${docId}?format=image`, {
        headers: { 'Authorization': `Bearer ${process.env.GAMMA_API_KEY}` }
      });
      if(imgRes.ok){
        const imgJson = await imgRes.json();
        company.ogImage = imgJson.url || imgJson.downloadUrl;
      }
    }
  } catch (err) {
    console.warn('Gamma generation skipped:', err.message);
  }
  return company;
}

function esc(str){
  return String(str||'').replaceAll('"','&quot;');
}

async function main(){
  const baseDir = path.resolve('companies');
  await ensureDir(baseDir);

  let companies;
  if(NOTION_ENABLED){
    companies = await fetchNotionCompanies();
  } else {
    // Read existing data.json (no Notion)
    try {
      const raw = await fs.readFile(path.join(baseDir, 'data.json'), 'utf-8');
      companies = JSON.parse(raw);
    } catch {
      companies = [];
    }
  }

  // Enrich with Gamma assets when available
  if (companies && companies.length) {
    const enriched = [];
    for (const c of companies) {
      enriched.push(await maybeGammaGenerate(c));
    }
    companies = enriched;
  }

  // Write data.json back (now with Gamma fields)
  await fs.writeFile(path.join(baseDir, 'data.json'), JSON.stringify(companies, null, 2));

  // Generate/refresh detail pages
  for(const c of companies){
    const slug = (c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'));
    const dir = path.join(baseDir, slug);
    await ensureDir(dir);
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>${esc(c.name)} — Utlyze Companies</title><meta name="description" content="${esc(c.tagline)}"/>${c.ogImage?`<meta property=\"og:image\" content=\"${esc(c.ogImage)}\"/>`:''}<link rel="stylesheet" href="../style.css"/></head><body><header class="header"><div class="container"><div class="header__content"><div class="logo"><h1 class="logo__text">Utlyze Companies</h1><p class="logo__tagline">A gallery of ideas and ventures we’re building</p></div></div></div></header><section class="hero"><div class="container"><div class="hero__content"><h2 class="hero__title">${esc(c.name)}</h2><p class="hero__description">${esc(c.tagline)}</p><div><a class="btn btn--primary" href="${c.demoUrl||'#'}" target="_blank" rel="noopener">Explore the app</a><a class="btn btn--outline" href="${c.websiteUrl||'#'}" target="_blank" rel="noopener">Visit website</a><a class="btn btn--outline" href="/companies/">Back to gallery</a></div>${c.onePagerPdfUrl?`<div style=\"margin-top:16px\"><a class=\"btn btn--outline\" href=\"${esc(c.onePagerPdfUrl)}\" target=\"_blank\" rel=\"noopener\">Download one‑pager (PDF)</a></div>`:''}</div></div></section><section class="section"><div class="container"><h3>Overview</h3><p>${esc(c.description)}</p><h3>Highlights</h3><ul>${(c.achievements||[]).map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div></section><footer class="footer"><div class="container"><div class="footer__content"><div class="footer__section"><h3>Contact Us</h3><p>Email: <a href="mailto:hello@utlyze.com">hello@utlyze.com</a></p></div><div class="footer__section"><h3>Follow Us</h3><div class="social-links"><a href="https://www.linkedin.com/company/utlyze" target="_blank" rel="noopener">LinkedIn</a></div></div></div><div class="footer__bottom"><p>&copy; 2025 Utlyze. All rights reserved.</p></div></div></footer></body></html>`;
    await fs.writeFile(path.join(dir, 'index.html'), html);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
