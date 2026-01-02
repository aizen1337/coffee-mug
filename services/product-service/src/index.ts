import logger from 'jet-logger';
import ENV from '@src/common/constants/ENV';
import server from './server';
import { startOrderCreatedConsumer } from './consumers/OrderCreated';
import mongoose from 'mongoose';

/******************************************************************************/
/*                                Constants                                   */
/******************************************************************************/

const SERVER_START_MSG = `Express server started on port: ${ENV.Port}`;

/******************************************************************************/
/*                                  Run                                       */
/******************************************************************************/

const startServer = async () => {
  try {
    logger.info('Starting server...');

    // Start Express server
    await new Promise<void>((resolve, reject) => {
      server.listen(ENV.Port, (err: unknown) => {
        if (err) return
        logger.info(`Express server listening on port ${ENV.Port}`);
        resolve();
      });
    });

    // Connect to MongoDB
    try {
      logger.info('Connecting to MongoDB...');
      // eslint-disable-next-line n/no-process-env
      await mongoose.connect(process.env.MONGODB_URI!);
      logger.info('MongoDB connected successfully');
    } catch (err: unknown) {
      logger.err('MongoDB connection failed:');
      logger.err(err);
      throw err; // Stop startup if DB fails
    }

    // Start Kafka consumer
    try {
      logger.info('Starting OrderCreated Kafka consumer...');
      await startOrderCreatedConsumer();
      logger.info('Kafka consumer started successfully');
    } catch (err: unknown) {
      logger.err('Kafka consumer failed to start:');
      logger.err(err);
      throw err; // Stop startup if consumer fails
    }

    logger.info(SERVER_START_MSG);
  } catch (err: unknown) {
    logger.err('Server startup failed:');
    logger.err(err);
  }
};

// Run the startup sequence
startServer();
