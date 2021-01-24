import { Role } from '@common/enum/Role.enum';
import authorizationMiddleware from '@middleware/Authorization.middleware';
import uiVersionMiddleware from '@middleware/UiVersion.middleware';
import validationMiddleware from '@middleware/Validation.middleware';
import express, { IRouter, NextFunction, Request, Response } from 'express';
import paramValidationMiddleware from '@middleware/ParamValidation.middleware';

type IOption = {
  type?: object;
  param?: object;
  status?: number;
};

export default class RouterBuilder {
  private router: IRouter;

  public constructor() {
    this.router = express.Router();
  }

  public child(path: string, router: IRouter) {
    this.router.use(path, router);
  }

  public post(
    path: string,
    service: (req: Request) => any,
    option: IOption = {},
  ) {
    this.router.post(
      path,
      authorizationMiddleware(),
      validationMiddleware(option.type),
      paramValidationMiddleware(option.param),
      uiVersionMiddleware(),
      this.createHandler(service, option.status),
    );
  }

  public put(
    path: string,
    service: (req: Request) => any,
    option: IOption = {},
  ) {
    this.router.put(
      path,
      authorizationMiddleware(),
      validationMiddleware(option.type),
      paramValidationMiddleware(option.param),
      uiVersionMiddleware(),
      this.createHandler(service, option.status),
    );
  }

  public get(
    path: string,
    service: (req: Request) => any,
    option: IOption = {},
  ) {
    this.router.get(
      path,
      authorizationMiddleware(),
      paramValidationMiddleware(option.param),
      uiVersionMiddleware(),
      this.createHandler(service, option.status),
    );
  }

  public delete(
    path: string,
    service: (req: Request) => any,
    option: IOption = {},
  ) {
    this.router.delete(
      path,
      authorizationMiddleware(),
      paramValidationMiddleware(option.param),
      uiVersionMiddleware(),
      this.createHandler(service, option.status),
    );
  }

  public build() {
    return this.router;
  }

  createHandler(service: (req: Request) => any, status = 200) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.status(status).json(await service(req));
      } catch (error) {
        next(error);
      }
    };
  }
}
