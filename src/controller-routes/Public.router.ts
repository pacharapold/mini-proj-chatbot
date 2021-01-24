import RouterBuilder from '@route/RouterBuilder';
import LineBotChatService from '@service/LineBotChat.service';
import { Request } from 'express';

const builder = new RouterBuilder();

builder.post(
  '',
  async (req: Request) => await LineBotChatService.response(req.body),
);

export default builder.build();
