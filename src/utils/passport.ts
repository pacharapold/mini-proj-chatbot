import { Request } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from 'passport-jwt';
import config from '@config/config';
import { Invalid, EC, HS } from '@common/error/Invalid.error';
import { Role } from '@common/enum/Role.enum';

export interface IPayloadInfo {
  role: Role;
  id: number | null;
  username: string;
  rememberMe: boolean;
  impersonate: boolean;
  iat?: string;
  exp?: string;
}

export const invalidNeedLogin = Invalid.unAuthorized(EC.NEED_LOGIN);

export const invalidNeedOtherRole = (role: Role) => {
  return Invalid.unAuthorized(EC.NEED_OTHER_ROLE, {
    role: `${Role[role]}`,
  });
};

export const invalidJwtExpired = new Invalid(
  EC.SESSION_EXPIRED,
  HS.BAD_REQUEST,
);

// verify token
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.SECRET_KEY,
    },
    async (payload, done) => {
      try {
        return done(null, payload);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

// get payload info
export const getPayloadInfo = (req: Request) => {
  const payload: IPayloadInfo | null = req.body.payload;
  if (!payload) {
    throw invalidNeedLogin;
  }

  delete payload.exp;
  delete payload.iat;
  return payload;
};

export const authJWT = async (req: Request) => {
  let authPayload;

  await passport.authenticate(
    'jwt',
    { session: false },
    (err, payload, info) => {
      if (!payload || err) {
        throw invalidNeedLogin;
      }
      authPayload = payload;
    },
  )(req);

  return authPayload;
};

export const signJWT = (
  payloadInfo: IPayloadInfo | any,
  expiresIn: string = '1 days',
) => {
  return jwt.sign({ ...payloadInfo }, config.SECRET_KEY, {
    expiresIn,
  });
};

export const decodeJWT = (token: any): any => {
  return jwt.decode(token, { complete: true });
};

export const verifyJWT = (token: string): any => {
  try {
    return jwt.verify(token, config.SECRET_KEY);
  } catch (e) {
    throw invalidJwtExpired;
  }
};
