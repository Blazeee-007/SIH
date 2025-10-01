const { runQuery, getQuery } = require('../config/database');

async function createRefreshToken(userId, token, expiresIn) {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

  const result = await runQuery(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );

  return result.lastID;
}

async function getRefreshToken(token) {
  return getQuery('SELECT * FROM refresh_tokens WHERE token = ?', [token]);
}

async function deleteRefreshToken(token) {
  const result = await runQuery('DELETE FROM refresh_tokens WHERE token = ?', [token]);
  return result.changes > 0;
}

async function deleteUserRefreshTokens(userId) {
  const result = await runQuery('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
  return result.changes > 0;
}

async function cleanExpiredTokens() {
  const now = Math.floor(Date.now() / 1000);
  const result = await runQuery('DELETE FROM refresh_tokens WHERE expires_at < ?', [now]);
  return result.changes;
}

module.exports = {
  createRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  deleteUserRefreshTokens,
  cleanExpiredTokens
};
