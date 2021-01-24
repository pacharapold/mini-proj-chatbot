import RouterBuilder from '@route/RouterBuilder';
import { Request } from 'express';

const builder = new RouterBuilder();

builder.post('', async (req: Request) => {
  return { msg: 'success' };
});

export default builder.build();
