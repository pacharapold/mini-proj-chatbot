import { EC, Invalid } from '@common/error/Invalid.error';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import express from 'express';

function paramValidationMiddleware<T>(type: any): express.RequestHandler {
  return (req, res, next) => {
    plainToClass(type, req.params);
    if (type === undefined || typeof type !== 'function') {
      next();
    } else {
      validate(plainToClass(type, req.params))
        .then((errors: ValidationError[]) => {
          if (errors.length > 0) {
            const message = errors
              .map((error: ValidationError) =>
                Object.values(error.constraints!),
              )
              .join(', ');
            next(Invalid.badRequest(EC.INVALID_REQUEST, message));
          } else {
            next();
          }
        })
        .catch(error => {
          next(Invalid.badRequest(EC.INVALID_REQUEST, error));
        });
    }
  };
}

export default paramValidationMiddleware;
