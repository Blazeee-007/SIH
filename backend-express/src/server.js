const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { initializeDatabase } = require('./database/init');

const PORT = config.port;
const HOST = config.host;

async function startServer() {
  try {
    await initializeDatabase();
    logger.info('Database initialized successfully');

    const server = app.listen(PORT, HOST, () => {
      logger.info(`Server running in ${config.nodeEnv} mode`);
      logger.info(`Server listening on http://${HOST}:${PORT}`);
      logger.info(`API available at http://${HOST}:${PORT}/api`);
    });

    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      server.close(() => {
        logger.info('Server closed. Exiting process.');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
