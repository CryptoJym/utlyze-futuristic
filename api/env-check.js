export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const hasSlack = Boolean(process.env.SLACK_WEBHOOK_URL);
  const hasNextPublic = Boolean(process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL);
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown';
  res.status(200).send(JSON.stringify({ ok: true, env, hasSlack, hasNextPublic }));
}

