const { createClient } = require('@supabase/supabase-js');

function parseRequestBody(body) {
  if (typeof body === 'string') {
    return JSON.parse(body || '{}');
  }

  if (Buffer.isBuffer(body)) {
    return JSON.parse(body.toString('utf8') || '{}');
  }

  return body || {};
}

function getBearerToken(header) {
  if (!header || typeof header !== 'string') {
    return null;
  }

  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  let payload;
  try {
    payload = parseRequestBody(req.body);
  } catch {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  if (typeof payload !== 'object' || Array.isArray(payload)) {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  const jwt = getBearerToken(req.headers.authorization || '');
  if (!jwt) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ error: 'Database is not configured.' });
  }

  if (!adminEmail) {
    return res.status(503).json({ error: 'Admin email is not configured.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
  if (authError || !user || !user.email) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  if (user.email.toLowerCase() !== adminEmail) {
    return res.status(403).json({ error: 'Forbidden.' });
  }

  const action = String(payload.action || '').trim();

  if (action === 'list') {
    const { data, error } = await supabase
      .from('public_reviews')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message || 'Unable to load pending reviews.' });
    }

    return res.status(200).json({ reviews: data || [] });
  }

  if (action === 'update') {
    const id = payload.id;
    const status = String(payload.status || '').trim();

    if (!id || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'A valid review ID and status are required.' });
    }

    const { error } = await supabase
      .from('public_reviews')
      .update({ status })
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message || 'Unable to update review status.' });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Unsupported action.' });
};
