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

  try {
    const body = parseRequestBody(req.body);
    if (typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }
  } catch {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  res.setHeader(
    'Set-Cookie',
    'admin_session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0'
  );

  return res.status(200).json({ success: true });
};
