import { authJWT } from '@util/passport';
import express from 'express';

function authorizationMiddleware(
  auth: boolean = false,
): express.RequestHandler {
  return async (req, res, next) => {
    try {
      if (auth) {
        req.body.payload = await authJWT(req);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default authorizationMiddleware;
