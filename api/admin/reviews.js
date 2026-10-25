const { createClient } = require('@supabase/supabase-js');

function parseCookies(header) {
  if (!header) return {};
  return Object.fromEntries(
    header
      .split(';')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        const [key, ...valueParts] = part.split('=');
        return [key, decodeURIComponent(valueParts.join('='))];
      })
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const cookies = parseCookies(req.headers.cookie || '');
  if (cookies.admin_session !== 'authenticated') {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const payload = req.body || {};
  const action = String(payload.action || '').trim();

  if (action === 'list') {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(503).json({ error: 'Database is not configured.' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

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

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(503).json({ error: 'Database is not configured.' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

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
