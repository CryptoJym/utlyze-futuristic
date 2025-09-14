// Vercel Serverless Function: Secure Slack notification proxy
// Usage: client calls POST /api/notify-lead with { context, payload }

export default async function handler(req, res) {
  // Allow simple CORS for POST from same site and local previews
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const webhook = process.env.SLACK_WEBHOOK_URL || process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL;
  if (!webhook) {
    return res.status(500).json({ ok: false, error: 'Slack webhook not configured' });
  }

  try {
    const { context, payload } = req.body || {};
    const ctx = typeof context === 'string' ? context : 'lead';
    const p = payload || {};
    const name = p.name || [p.first_name, p.last_name].filter(Boolean).join(' ') || '—';
    const lines = [
      `New ${ctx} submission`,
      `• Name: ${name}`,
      `• Company: ${p.company || '—'}`,
      `• Email: ${p.email || '—'}`,
      p.primary_interest ? `• Interest: ${p.primary_interest}` : (p.interest ? `• Interest: ${p.interest}` : ''),
      p.message ? `• Message: ${String(p.message).slice(0, 500)}` : '',
      p.utlyze_effective_monthly != null ? `• Est. Utlyze monthly: $${p.utlyze_effective_monthly}` : '',
      p.savings != null ? `• Est. savings: $${p.savings}` : '',
      p.roi_percentage != null ? `• ROI: ${p.roi_percentage}%` : '',
      `• Page: ${p.page_url || '—'}`,
      `• UTM: ${['source','medium','campaign','term','content'].map(k=>`${k}=${p[`utm_${k}`]||''}`).join(' ')}`
    ].filter(Boolean);

    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: lines.join('\n') })
    });

    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      return res.status(502).json({ ok: false, error: 'Slack webhook failed', status: resp.status, body });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Unknown error' });
  }
}

