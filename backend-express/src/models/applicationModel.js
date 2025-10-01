const { runQuery, getQuery, allQuery } = require('../config/database');

async function createApplication(applicationData) {
  const { internship_id, student_id, cover_letter, resume_url } = applicationData;

  const result = await runQuery(
    `INSERT INTO applications (internship_id, student_id, cover_letter, resume_url)
     VALUES (?, ?, ?, ?)`,
    [internship_id, student_id, cover_letter, resume_url || null]
  );

  return getApplicationById(result.lastID);
}

async function getApplicationById(id) {
  return getQuery(
    `SELECT a.*,
            u.name as student_name, u.email as student_email, u.phone as student_phone,
            i.title as internship_title, i.company as company_name,
            m.name as mentor_name
     FROM applications a
     LEFT JOIN users u ON a.student_id = u.id
     LEFT JOIN internships i ON a.internship_id = i.id
     LEFT JOIN users m ON i.mentor_id = m.id
     WHERE a.id = ?`,
    [id]
  );
}

async function getAllApplications(filters = {}) {
  let query = `
    SELECT a.*,
           u.name as student_name, u.email as student_email,
           i.title as internship_title, i.company as company_name
    FROM applications a
    LEFT JOIN users u ON a.student_id = u.id
    LEFT JOIN internships i ON a.internship_id = i.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.internship_id) {
    query += ' AND a.internship_id = ?';
    params.push(filters.internship_id);
  }

  if (filters.student_id) {
    query += ' AND a.student_id = ?';
    params.push(filters.student_id);
  }

  if (filters.status) {
    query += ' AND a.status = ?';
    params.push(filters.status);
  }

  if (filters.mentor_id) {
    query += ' AND i.mentor_id = ?';
    params.push(filters.mentor_id);
  }

  query += ' ORDER BY a.applied_at DESC';

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

async function updateApplicationStatus(id, status, reviewerNotes = null) {
  await runQuery(
    `UPDATE applications
     SET status = ?, reviewed_at = ?, reviewer_notes = ?
     WHERE id = ?`,
    [status, Date.now(), reviewerNotes, id]
  );

  return getApplicationById(id);
}

async function deleteApplication(id) {
  const result = await runQuery('DELETE FROM applications WHERE id = ?', [id]);
  return result.changes > 0;
}

async function checkExistingApplication(internshipId, studentId) {
  const application = await getQuery(
    'SELECT * FROM applications WHERE internship_id = ? AND student_id = ?',
    [internshipId, studentId]
  );
  return application !== undefined;
}

async function getApplicationsByStudent(studentId) {
  return allQuery(
    `SELECT a.*,
            i.title as internship_title, i.company as company_name, i.location,
            m.name as mentor_name
     FROM applications a
     LEFT JOIN internships i ON a.internship_id = i.id
     LEFT JOIN users m ON i.mentor_id = m.id
     WHERE a.student_id = ?
     ORDER BY a.applied_at DESC`,
    [studentId]
  );
}

module.exports = {
  createApplication,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
  checkExistingApplication,
  getApplicationsByStudent
};
