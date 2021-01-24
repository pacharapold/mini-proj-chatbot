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
          hero: {
            type: 'image',
            url:
              'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover',
            action: {
              type: 'uri',
              uri: 'http://linecorp.com/',
            },
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Brown Cafe',
                weight: 'bold',
                size: 'xl',
              },
              {
                type: 'box',
                layout: 'baseline',
                margin: 'md',
                contents: [
                  {
                    type: 'icon',
                    size: 'sm',
                    url:
                      'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png',
                  },
                  {
                    type: 'icon',
                    size: 'sm',
                    url:
                      'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png',
                  },
                  {
                    type: 'icon',
                    size: 'sm',
                    url:
                      'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png',
                  },
                  {
                    type: 'icon',
                    size: 'sm',
                    url:
                      'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png',
                  },
                  {
                    type: 'icon',
                    size: 'sm',
                    url:
                      'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png',
                  },
                  {
                    type: 'text',
                    text: '4.0',
                    size: 'sm',
                    color: '#999999',
                    margin: 'md',
                    flex: 0,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'vertical',
                margin: 'lg',
                spacing: 'sm',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: 'Place',
                        color: '#aaaaaa',
                        size: 'sm',
                        flex: 1,
                      },
                      {
                        type: 'text',
                        text: 'Miraina Tower, 4-1-6 Shinjuku, Tokyo',
                        wrap: true,
                        color: '#666666',
                        size: 'sm',
                        flex: 5,
                      },
                    ],
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: 'Time',
                        color: '#aaaaaa',
                        size: 'sm',
                        flex: 1,
                      },
                      {
                        type: 'text',
                        text: '10:00 - 23:00',
                        wrap: true,
                        color: '#666666',
                        size: 'sm',
                        flex: 5,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'button',
                style: 'link',
                height: 'sm',
                action: {
                  type: 'uri',
                  label: 'CALL',
                  uri: 'https://linecorp.com',
                },
              },
              {
                type: 'button',
                style: 'link',
                height: 'sm',
                action: {
                  type: 'uri',
                  label: 'WEBSITE',
                  uri: 'https://linecorp.com',
                },
              },
              {
                type: 'spacer',
                size: 'sm',
              },
            ],
            flex: 0,
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
