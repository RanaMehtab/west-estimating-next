import { NextResponse } from 'next/server';

/**
 * POST /api/contact — handle contact form submissions.
 *
 * If a CONTACT_EMAIL or FORM_WEBHOOK environment variable is set (Cloudflare
 * dashboard → Workers & Pages → your worker → Settings → Variables), the
 * submission is forwarded there. Otherwise it's just logged — useful in dev.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, phone, company, service, message } = body || {};

  const errors = {};
  if (!name || String(name).trim().length < 2) errors.name = 'Please enter your name.';
  if (!email || !EMAIL_RE.test(String(email))) errors.email = 'Please enter a valid email.';
  if (!message || String(message).trim().length < 10)
    errors.message = 'Please provide a bit more detail (10+ characters).';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const submission = {
    name: String(name).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : '',
    company: company ? String(company).trim() : '',
    service: service ? String(service).trim() : '',
    message: String(message).trim(),
    at: new Date().toISOString(),
    ip: request.headers.get('cf-connecting-ip') || ''
  };

  // Visible in `wrangler tail` and the Cloudflare dashboard logs.
  console.log('[contact]', JSON.stringify(submission));

  // Cloudflare Workers env bindings are available via process.env when
  // declared in wrangler.jsonc "vars", or via the second handler argument
  // in more advanced setups. Kept simple here for portability.
  const webhook = process.env.FORM_WEBHOOK;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(submission)
      });
    } catch (err) {
      console.error('[contact] webhook forward failed:', err);
    }
  }

  return NextResponse.json({
    ok: true,
    message: 'Thanks for reaching out. Our estimating team will follow up within one business day.'
  });
}
