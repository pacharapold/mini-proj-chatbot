export interface IBotWebhook {
  events: IRequestBody[];
  destination: string;
}

export interface IRequestBody {
  type: string;
  replyToken: string;
  source: ISource;
  timestamp: Date;
  mode: string;
  message: IMessage;
}

export interface ISource {
  userId: string;
  type: string;
  groupId?: string;
}

export interface IMessage {
  type: string;
  id: string;
  text?: string;
  stickerId?: string;
  packageId?: string;
}

export interface IProfile {
  userId: string;
  displayName: string;
  pictureUrl: string;
  language: string;
}
