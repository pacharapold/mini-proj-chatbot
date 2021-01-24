import RouterBuilder from '@route/RouterBuilder';
import OtpRequestService from '@service/OtpRequest.service';
import { OtpRequestNewDto } from '@type/OtpRequest.dto';
import { Request } from 'express';

const builder = new RouterBuilder();

builder.post(
  '',
  async (req: Request) => await OtpRequestService.newOtpRequest(req.body),
  { type: OtpRequestNewDto },
);

export default builder.build();
