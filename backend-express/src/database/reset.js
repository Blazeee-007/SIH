const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');
const { closeDatabase } = require('../config/database');
const { seedDatabase } = require('./seed');

async function resetDatabase() {
  try {
    logger.info('Resetting database...');

    await closeDatabase();

    const dbPath = config.database.path;

    if (fs.existsSync(dbPath)) {
      const backupPath = path.join(
        config.database.backupPath,
        `backup-${Date.now()}.db`
      );

      fs.copyFileSync(dbPath, backupPath);
      logger.info(`Backup created at ${backupPath}`);

      fs.unlinkSync(dbPath);
      logger.info('Database file deleted');
    }

    const walPath = `${dbPath}-wal`;
    const shmPath = `${dbPath}-shm`;
    const journalPath = `${dbPath}-journal`;

    if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
    if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);
    if (fs.existsSync(journalPath)) fs.unlinkSync(journalPath);

    logger.info('Reinitializing database with seed data...');
    await seedDatabase();

    logger.info('Database reset completed successfully');
  } catch (error) {
    logger.error('Database reset error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase };
