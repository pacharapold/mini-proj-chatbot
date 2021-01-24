export interface IBotWebhook {
  events: IRequestBody[];
  destination: string;
}

export interface IRequestBody {
  type: string;
  replyToken: string;
  source: any;
  timestamp: Date;
  mode: string;
  message: any;
}
