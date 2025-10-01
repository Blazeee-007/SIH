const bcrypt = require('bcryptjs');
const { runQuery, getQuery, allQuery } = require('../config/database');
const config = require('../config');

async function createUser(userData) {
  const { email, password, name, role, phone, bio, skills } = userData;

  const hashedPassword = await bcrypt.hash(password, config.security.bcryptSaltRounds);

  const result = await runQuery(
    `INSERT INTO users (email, password, name, role, phone, bio, skills)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [email, hashedPassword, name, role, phone || null, bio || null, skills || null]
  );

  return getUserById(result.lastID);
}

async function getUserById(id) {
  return getQuery('SELECT * FROM users WHERE id = ?', [id]);
}

async function getUserByEmail(email) {
  return getQuery('SELECT * FROM users WHERE email = ?', [email]);
}

async function getAllUsers(filters = {}) {
  let query = 'SELECT id, email, name, role, phone, bio, skills, avatar_url, is_active, is_verified, created_at FROM users WHERE 1=1';
  const params = [];

  if (filters.role) {
    query += ' AND role = ?';
    params.push(filters.role);
  }

  if (filters.is_active !== undefined) {
    query += ' AND is_active = ?';
    params.push(filters.is_active ? 1 : 0);
  }

  if (filters.search) {
    query += ' AND (name LIKE ? OR email LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  query += ' ORDER BY created_at DESC';

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
  }

  if (filters.offset) {
    query += ' OFFSET ?';
    params.push(filters.offset);
  }

  return allQuery(query, params);
}

async function updateUser(id, updates) {
  const allowedFields = ['name', 'phone', 'bio', 'skills', 'avatar_url', 'resume_url'];
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    return getUserById(id);
  }

  values.push(Date.now());
  values.push(id);

  await runQuery(
    `UPDATE users SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`,
    values
  );

  return getUserById(id);
}

async function updateUserPassword(id, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptSaltRounds);

  await runQuery(
    'UPDATE users SET password = ?, updated_at = ? WHERE id = ?',
    [hashedPassword, Date.now(), id]
  );

  return true;
}

async function deleteUser(id) {
  const result = await runQuery('DELETE FROM users WHERE id = ?', [id]);
  return result.changes > 0;
}

async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

async function incrementLoginAttempts(id) {
  await runQuery(
    'UPDATE users SET login_attempts = login_attempts + 1 WHERE id = ?',
    [id]
  );
}

async function resetLoginAttempts(id) {
  await runQuery(
    'UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?',
    [id]
  );
}

async function lockUser(id) {
  const lockUntil = Date.now() + config.security.lockTime;
  await runQuery(
    'UPDATE users SET locked_until = ? WHERE id = ?',
    [lockUntil, id]
  );
}

async function updateUserStatus(id, isActive) {
  await runQuery(
    'UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?',
    [isActive ? 1 : 0, Date.now(), id]
  );
  return getUserById(id);
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUser,
  updateUserPassword,
  deleteUser,
  verifyPassword,
  incrementLoginAttempts,
  resetLoginAttempts,
  lockUser,
  updateUserStatus
};
