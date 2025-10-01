const { runQuery, getQuery, allQuery } = require('../config/database');

async function createTask(taskData) {
  const {
    internship_id, assigned_to, title, description, due_date,
    priority, max_points, created_by
  } = taskData;

  const result = await runQuery(
    `INSERT INTO tasks (internship_id, assigned_to, title, description, due_date, priority, max_points, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [internship_id, assigned_to || null, title, description, due_date, priority || 'medium', max_points || 100, created_by]
  );

  return getTaskById(result.lastID);
}

async function getTaskById(id) {
  return getQuery(
    `SELECT t.*,
            u.name as assigned_to_name,
            i.title as internship_title,
            c.name as created_by_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     LEFT JOIN internships i ON t.internship_id = i.id
     LEFT JOIN users c ON t.created_by = c.id
     WHERE t.id = ?`,
    [id]
  );
}

async function getAllTasks(filters = {}) {
  let query = `
    SELECT t.*,
           u.name as assigned_to_name,
           i.title as internship_title
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN internships i ON t.internship_id = i.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.internship_id) {
    query += ' AND t.internship_id = ?';
    params.push(filters.internship_id);
  }

  if (filters.assigned_to) {
    query += ' AND t.assigned_to = ?';
    params.push(filters.assigned_to);
  }

  if (filters.created_by) {
    query += ' AND t.created_by = ?';
    params.push(filters.created_by);
  }

  if (filters.status) {
    query += ' AND t.status = ?';
    params.push(filters.status);
  }

  if (filters.priority) {
    query += ' AND t.priority = ?';
    params.push(filters.priority);
  }

  query += ' ORDER BY t.due_date ASC, t.priority DESC';

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

async function updateTask(id, updates) {
  const allowedFields = ['title', 'description', 'due_date', 'priority', 'status', 'assigned_to', 'max_points'];
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    return getTaskById(id);
  }

  values.push(Date.now());
  values.push(id);

  await runQuery(
    `UPDATE tasks SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`,
    values
  );

  return getTaskById(id);
}

async function deleteTask(id) {
  const result = await runQuery('DELETE FROM tasks WHERE id = ?', [id]);
  return result.changes > 0;
}

module.exports = {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask
};
