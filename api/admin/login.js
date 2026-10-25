export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const email = String(req.body?.email || '').trim();
  const password = String(req.body?.password || '');
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
}
