import { Gambler } from '@common/type/Gambler.model';
import { IBotWebhook, IProfile } from '@common/type/LineBotChat.interface';
import config from '@config/config';
import axios from 'axios';
import BigNumber from 'bignumber.js';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.LINE_ACCESS_TOKEN}`,
};

export default {
  async response({ events }: IBotWebhook) {
    const replyToken = events[0].replyToken;
    const userId = events[0].source.userId;
    let msg = null;
    if (events[0].message.text) {
      msg = events[0].message.text.toLowerCase();
    }
    if (!msg) return {};
    // let result = null;
    switch (msg) {
      case 'cf': {
        await this.register(userId, replyToken);
        break;
      }
    }
    return {};
  },

  async register(userId: string, replyToken: string) {
    const profile = await this.getProfile(userId);
    const count = await Gambler.count({});
    let gm = await Gambler.findOne({ where: { userId } });
    if (!gm) {
      // * Create Gambler
      gm = await Gambler.create({
        userId,
        username: `HIFIVE-${count + 1}`,
        balance: new BigNumber(0),
        lastBalanceUpdate: new Date().toISOString(),
      });
    }
    const flex = [
      {
        type: 'flex',
        altText: 'Flex Message',
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url:
                      'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
                  },
                ],
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'horizontal',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: 'title 3',
                      },
                      {
                        type: 'text',
                        text: 'detail 3',
                      },
                    ],
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: 'title 3',
                      },
                      {
                        type: 'text',
                        text: 'detail 3',
                      },
                    ],
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: 'title 3',
                      },
                      {
                        type: 'text',
                        text: 'detail 3',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    ];
    await this.replyFlexMsg(replyToken, flex);
  },

  async replyMsg(replyToken: string, msg: string) {
    const body = JSON.stringify({
      replyToken,
      messages: [
        {
          type: 'text',
          text: msg,
        },
      ],
    });
    const req = await axios.post(
      `https://api.line.me/v2/bot/message/reply`,
      body,
      {
        headers,
      },
    );
    return req;
  },

  async replyFlexMsg(replyToken: string, msg: any) {
    const body = JSON.stringify({
      replyToken,
      messages: msg,
    });
    const req = await axios.post(
      `https://api.line.me/v2/bot/message/reply`,
      body,
      {
        headers,
      },
    );
    return req;
  },

  async getProfile(userId: string) {
    return (
      await axios.get(`https://api.line.me/v2/bot/profile/${userId}`, {
        headers,
      })
    ).data as IProfile;
  },
};
