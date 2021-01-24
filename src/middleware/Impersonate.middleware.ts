import { EC, Invalid } from '@common/error/Invalid.error';
import permissionRoute from '@config/permissionRoute';
import express from 'express';

function impersonateMiddleware(auth: boolean = false): express.RequestHandler {
  return async (req, res, next) => {
    try {
      if (auth) {
        const { impersonate } = req.body.payload;
        const { baseUrl, path } = req;

        const p = path === '/' ? baseUrl : baseUrl + path;
        if (permissionRoute.some(x => x === p) && impersonate) {
          throw Invalid.unAuthorized(EC.NEED_OTHER_ROLE);
        }
        return next();
      }
      return next();
    } catch (error) {
      next(error);
    }
  };
}

export default impersonateMiddleware;
