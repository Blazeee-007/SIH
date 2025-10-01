const sqlite3 = require('sqlite3').verbose();
const config = require('./index');
const logger = require('../utils/logger');

let db = null;

function getDatabase() {
  if (db) {
    return db;
  }

  db = new sqlite3.Database(config.database.path, (err) => {
    if (err) {
      logger.error('Error opening database:', err);
      throw err;
    }
    logger.info(`Connected to SQLite database at ${config.database.path}`);
  });

  db.configure('busyTimeout', 3000);

  db.run('PRAGMA foreign_keys = ON');
  db.run('PRAGMA journal_mode = WAL');

  return db;
}

function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }

    db.close((err) => {
      if (err) {
        logger.error('Error closing database:', err);
        reject(err);
      } else {
        logger.info('Database connection closed');
        db = null;
        resolve();
      }
    });
  });
}

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    database.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    database.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    database.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  getDatabase,
  closeDatabase,
  runQuery,
  getQuery,
  allQuery
};
