import { EC, Invalid } from '@common/error/Invalid.error';
import { NextFunction, Request, Response } from 'express';

function errorMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof Invalid) {
    const httpStatus = error.httpStatus ?? 500;
    const errorCode = error.errorCode ?? EC.UNKNOWN_ERROR;
    const details = error.details ?? undefined;
    response
      .status(httpStatus)
      .json({ errorCode, details })
      .end();
  } else {
    console.log(error);
    response
      .status(500)
      .json({
        errorCode: EC[0],
        details: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      })
      .end();
  }
}

export default errorMiddleware;
