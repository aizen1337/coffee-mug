import HTTP_STATUS_CODES, {
  HttpStatusCodes,
} from '@src/common/constants/HTTP_STATUS_CODES';

/******************************************************************************
                                 Classes
******************************************************************************/

/**
 * Error with status code and message.
 */
export class RouteError extends Error {
  public status: HttpStatusCodes;

  public constructor(status: HttpStatusCodes, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Handle "parseObj" errors.
 */