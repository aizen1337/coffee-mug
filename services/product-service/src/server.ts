import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import BaseRouter from '@src/routes';

import Paths from '@src/common/constants/PATHS';
import ENV from '@src/common/constants/ENV';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { RouteError } from '@src/common/util/route-errors';
import { NODE_ENVS } from '@src/common/constants';
import { requestLogger } from '@src/middleware/requestLogger';


/******************************************************************************
                                Setup
******************************************************************************/

const app = express();


// **** Middleware **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(requestLogger)
// Show routes called in console during development
if (ENV.NodeEnv === NODE_ENVS.Dev) {
  app.use(morgan('dev'));
}

// Security
if (ENV.NodeEnv === NODE_ENVS.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

// Add APIs, must be after middleware
app.use(Paths._, BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, _next: NextFunction) => {
  if (ENV.NodeEnv !== NODE_ENVS.Test) {
    logger.err(err, true);
  }

  if (err instanceof RouteError) {
    res.status(err.status).json({
      error: err.message,
    });
    return; // ⬅️ CRITICAL
  }

  res.status(HTTP_STATUS_CODES.InternalServerError).json({
    error: 'Internal Server Error',
  });
});



// **** FrontEnd Content **** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to users pg by default
app.get('/', (_: Request, res: Response) => {
  return res.redirect('/users');
});

// Redirect to login if not logged in.
app.get('/users', (_: Request, res: Response) => {
  return res.sendFile('users.html', { root: viewsDir });
});


/******************************************************************************
                                Export default
******************************************************************************/

export default app;
