const { runQuery, getQuery, allQuery } = require('../config/database');

async function createSubmission(submissionData) {
  const { task_id, student_id, submission_text, submission_url } = submissionData;

  const result = await runQuery(
    `INSERT INTO task_submissions (task_id, student_id, submission_text, submission_url)
     VALUES (?, ?, ?, ?)`,
    [task_id, student_id, submission_text || null, submission_url || null]
  );

  return getSubmissionById(result.lastID);
}

async function getSubmissionById(id) {
  return getQuery(
    `SELECT s.*,
            u.name as student_name, u.email as student_email,
            t.title as task_title, t.max_points,
            g.name as graded_by_name
     FROM task_submissions s
     LEFT JOIN users u ON s.student_id = u.id
     LEFT JOIN tasks t ON s.task_id = t.id
     LEFT JOIN users g ON s.graded_by = g.id
     WHERE s.id = ?`,
    [id]
  );
}

async function getAllSubmissions(filters = {}) {
  let query = `
    SELECT s.*,
           u.name as student_name,
           t.title as task_title, t.max_points
    FROM task_submissions s
    LEFT JOIN users u ON s.student_id = u.id
    LEFT JOIN tasks t ON s.task_id = t.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.task_id) {
    query += ' AND s.task_id = ?';
    params.push(filters.task_id);
  }

  if (filters.student_id) {
    query += ' AND s.student_id = ?';
    params.push(filters.student_id);
  }

  if (filters.graded !== undefined) {
    if (filters.graded) {
      query += ' AND s.grade IS NOT NULL';
    } else {
      query += ' AND s.grade IS NULL';
    }
  }

  query += ' ORDER BY s.submitted_at DESC';

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

async function gradeSubmission(id, gradeData) {
  const { grade, feedback, graded_by } = gradeData;

  await runQuery(
    `UPDATE task_submissions
     SET grade = ?, feedback = ?, graded_at = ?, graded_by = ?
     WHERE id = ?`,
    [grade, feedback, Date.now(), graded_by, id]
  );

  return getSubmissionById(id);
}

async function checkExistingSubmission(taskId, studentId) {
  const submission = await getQuery(
    'SELECT * FROM task_submissions WHERE task_id = ? AND student_id = ?',
    [taskId, studentId]
  );
  return submission !== undefined;
}

module.exports = {
  createSubmission,
  getSubmissionById,
  getAllSubmissions,
  gradeSubmission,
  checkExistingSubmission
};
