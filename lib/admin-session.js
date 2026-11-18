const crypto = require('crypto');

const SESSION_TTL_SECONDS = 60 * 60;

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function createAdminSessionToken(now = Date.now()) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error('Admin session secret is not configured.');
  }

  const expiresAt = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expiresAt);
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

function isValidAdminSessionToken(token, now = Date.now()) {
  const secret = getSessionSecret();
  if (!secret || typeof token !== 'string') return false;

  const [expiresAtText, signature, ...extraParts] = token.split('.');
  if (extraParts.length || !/^\d+$/.test(expiresAtText) || !/^[a-f\d]{64}$/i.test(signature || '')) {
    return false;
  }

  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) {
    return false;
  }

  const expected = crypto.createHmac('sha256', secret).update(expiresAtText).digest();
  const actual = Buffer.from(signature, 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

module.exports = {
  createAdminSessionToken,
  isValidAdminSessionToken
};
