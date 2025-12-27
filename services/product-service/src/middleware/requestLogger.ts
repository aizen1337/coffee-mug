import { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on('finish', () => {
    logger.info(
      `[HTTP] ${req.method} ${req.originalUrl} ` +
      `${res.statusCode} ${Date.now() - start}ms`,
    );
  });

  next();
};
