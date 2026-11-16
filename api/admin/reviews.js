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
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  const jwt = getBearerToken(req.headers.authorization || '');
  if (!jwt) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const rawAdminEmail = process.env.ADMIN_EMAIL;
  const adminEmail = (rawAdminEmail || '').trim().toLowerCase();
  if (!adminEmail) { return res.status(503).json({ error: 'Admin email is not configured.' }); }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ error: 'Database is not configured.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: authData, error: authError } = await supabase.auth.getUser(jwt);
  if (authError || !authData?.user || !authData.user.email) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  if (authData.user.email.toLowerCase() !== adminEmail) {
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

    const { error, data } = await supabase
      .from('public_reviews')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message || 'Unable to update review status.' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Unsupported action.' });
};
