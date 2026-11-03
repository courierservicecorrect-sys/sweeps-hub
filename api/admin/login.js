function parseRequestBody(body) {
  if (typeof body === 'string') {
    return JSON.parse(body || '{}');
  }

  if (Buffer.isBuffer(body)) {
    return JSON.parse(body.toString('utf8') || '{}');
  }

  return body || {};
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  let body;
  try {
    body = parseRequestBody(req.body);
  } catch {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  if (typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  const email = String(body.email || '').trim();
  const password = String(body.password || '');

  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return res.status(503).json({ error: 'Admin login is not configured.' });
  }

  if (email !== expectedEmail || password !== expectedPassword) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  res.setHeader(
    'Set-Cookie',
    'admin_session=authenticated; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=3600'
  );

  return res.status(200).json({ success: true });
};
