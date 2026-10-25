const { createClient } = require('@supabase/supabase-js');

const allowedBrands = new Set([
  'Sportzino',
  'Fortune Coins',
  'Zula Casino',
  'LuckParty',
  'AmericanLuck'
]);

function send(res, statusCode, payload) {
  return res.status(statusCode).json(payload);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed.' });
  }

  const email = String(req.body?.email || '').trim();
  const brand = String(req.body?.brand || '').trim();
  const comment = String(req.body?.comment || '').trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
    return send(res, 400, { error: 'A valid email is required.' });
  }

  if (!brand || !allowedBrands.has(brand)) {
    return send(res, 400, { error: 'Unsupported brand.' });
  }

  if (!comment || comment.length < 25 || comment.length > 600) {
    return send(res, 400, { error: 'Review length must be between 25 and 600 characters.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return send(res, 503, { error: 'Database is not configured.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from('public_reviews')
    .insert([
      {
        brand_name: brand,
        user_email: email,
        review_text: comment,
        status: 'pending'
      }
    ]);

  if (error) {
    const msg = String(error.message || '').toLowerCase();
    if (msg.includes('duplicate') || msg.includes('already exists')) {
      return send(res, 409, { error: 'Duplicate review submission.' });
    }
    return send(res, 500, { error: 'Unable to submit review.' });
  }

  return send(res, 201, { success: true });
};
