import { getPayloadInfo, signJWT } from '@util/passport';
import { Request } from 'express';
export default {
  async refreshToken(req: Request) {
    const payload = getPayloadInfo(req);
    const token = signJWT(payload, payload.rememberMe ? '30 days' : '1 days');
    return { token };
  },
};
