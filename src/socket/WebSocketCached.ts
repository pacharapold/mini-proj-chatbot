import { Events } from '.';
import { IWebSocket } from './WebSocket';

export class WebSocketCached implements IWebSocket<Events> {
  public sendToUserParams: {
    userId: number;
    event: Events;
    args: any[];
  }[] = [];
  public sendToAllUsersParams: { event: Events; args: any[] }[] = [];
  public sendParams: { event: Events; args: any[] }[] = [];

  sendToUser(userId: number, event: Events, ...args: any[]): void {
    this.sendToUserParams.push({ userId, event, args });
  }

  sendToAllUsers(event: Events, ...args: any[]): void {
    this.sendToAllUsersParams.push({ event, args });
  }

  send(event: Events, ...args: any[]): void {
    this.sendParams.push({ event, args });
  }
}
