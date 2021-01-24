import { IBotWebhook } from '@common/type/LineBotChat.interface';

export default {
  async response(request: IBotWebhook) {
    console.log(JSON.stringify(request));
    return {};
  },
};
