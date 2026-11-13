const { createHmac, timingSafeEqual } = require('node:crypto');

const SESSION_TTL_SECONDS = 3600;

function isSessionSecretConfigured(secret) {
  return typeof secret === 'string' && Buffer.byteLength(secret, 'utf8') >= 32;
}

function createSessionToken(secret, now = Date.now()) {
  const expiresAt = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  const signature = createHmac('sha256', secret).update(String(expiresAt)).digest('hex');
  return `${expiresAt}.${signature}`;
}

function isValidSessionToken(token, secret, now = Date.now()) {
  if (!isSessionSecretConfigured(secret) || typeof token !== 'string') return false;

  const match = /^(\d+)\.([a-f0-9]{64})$/.exec(token);
  if (!match) return false;

  const expiresAt = Number(match[1]);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return false;

  const expected = createHmac('sha256', secret).update(match[1]).digest();
  const actual = Buffer.from(match[2], 'hex');
  return timingSafeEqual(expected, actual);
}

module.exports = {
  SESSION_TTL_SECONDS,
  createSessionToken,
  isSessionSecretConfigured,
  isValidSessionToken
};
