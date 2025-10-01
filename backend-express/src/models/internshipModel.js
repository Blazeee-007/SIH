const { runQuery, getQuery, allQuery } = require('../config/database');

async function createInternship(internshipData) {
  const {
    mentor_id, title, description, company, location, duration, stipend,
    requirements, skills_required, start_date, max_applicants, status
  } = internshipData;

  const result = await runQuery(
    `INSERT INTO internships (mentor_id, title, description, company, location, duration, stipend,
     requirements, skills_required, start_date, max_applicants, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      mentor_id, title, description, company, location, duration, stipend,
      requirements, skills_required, start_date, max_applicants, status || 'draft'
    ]
  );

  return getInternshipById(result.lastID);
}

async function getInternshipById(id) {
  const internship = await getQuery(
    `SELECT i.*, u.name as mentor_name, u.email as mentor_email
     FROM internships i
     LEFT JOIN users u ON i.mentor_id = u.id
     WHERE i.id = ?`,
    [id]
  );

  return internship;
}

async function getAllInternships(filters = {}) {
  let query = `
    SELECT i.*, u.name as mentor_name, u.email as mentor_email,
           (SELECT COUNT(*) FROM applications WHERE internship_id = i.id) as total_applications
    FROM internships i
    LEFT JOIN users u ON i.mentor_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.mentor_id) {
    query += ' AND i.mentor_id = ?';
    params.push(filters.mentor_id);
  }

  if (filters.status) {
    query += ' AND i.status = ?';
    params.push(filters.status);
  }

  if (filters.is_approved !== undefined) {
    query += ' AND i.is_approved = ?';
    params.push(filters.is_approved ? 1 : 0);
  }

  if (filters.search) {
    query += ' AND (i.title LIKE ? OR i.company LIKE ? OR i.description LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY i.created_at DESC';

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

async function updateInternship(id, updates) {
  const allowedFields = [
    'title', 'description', 'company', 'location', 'duration', 'stipend',
    'requirements', 'skills_required', 'start_date', 'end_date', 'max_applicants', 'status'
  ];
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    return getInternshipById(id);
  }

  values.push(Date.now());
  values.push(id);

  await runQuery(
    `UPDATE internships SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`,
    values
  );

  return getInternshipById(id);
}

async function deleteInternship(id) {
  const result = await runQuery('DELETE FROM internships WHERE id = ?', [id]);
  return result.changes > 0;
}

async function approveInternship(id) {
  await runQuery(
    'UPDATE internships SET is_approved = 1, updated_at = ? WHERE id = ?',
    [Date.now(), id]
  );
  return getInternshipById(id);
}

async function getInternshipsByMentor(mentorId) {
  return allQuery(
    `SELECT i.*,
            (SELECT COUNT(*) FROM applications WHERE internship_id = i.id) as total_applications
     FROM internships i
     WHERE i.mentor_id = ?
     ORDER BY i.created_at DESC`,
    [mentorId]
  );
}

module.exports = {
  createInternship,
  getInternshipById,
  getAllInternships,
  updateInternship,
  deleteInternship,
  approveInternship,
  getInternshipsByMentor
};
