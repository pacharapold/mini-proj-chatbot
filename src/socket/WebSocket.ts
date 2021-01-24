import * as http from 'http';
import * as socketio from 'socket.io';
import socketioJwt from 'socketio-jwt';

import { Events } from '.';

export interface IWebSocket<E> {
  sendToUser(userId: any, event: E, ...args: any[]): void;
  sendToAllUsers(event: Events, ...args: any[]): void;
  send(event: Events, ...args: any[]): void;
}

export class WebSocket implements IWebSocket<Events> {
  private server: http.Server;
  private io!: socketio.Server;
  private pio!: socketio.Server;
  private secret: string;

  constructor(server: http.Server, secret: string) {
    this.server = server;
    this.secret = secret;
  }

  listen(): void {
    // secure
    this.io = socketio.listen(this.server, { origins: '*:*', path: '/secure' });
    this.setAuthentication(this.io);
    this.io.on('connection', async socket => {
      const payload = this.extractPayload(socket);
      socket.join(payload.id);
      socket.on('disconnect', reason => {
        socket.leave(payload.id);
      });
    });

    // public
    this.pio = socketio.listen(this.server, { origins: '*:*' });
    this.pio.on('connect', async socket => {
      // tslint:disable-next-line: no-empty
      socket.on('disconnect', reason => {});
    });
  }

  private extractPayload(socket: any) {
    return socket.payload;
  }

  private setAuthentication(io: socketio.Server) {
    io.use(
      socketioJwt.authorize({
        secret: this.secret,
        handshake: true,
        decodedPropertyName: 'payload',
      }),
    );
  }

  sendToUser(userId: any, event: Events, ...args: any[]): void {
    try {
      this.io.to(userId).emit(event, args);
    } catch (error) {
      console.log('Error websocket send to user:', error);
    }
  }

  sendToAllUsers(event: Events, ...args: any[]): void {
    try {
      this.io.emit(event, args);
    } catch (error) {
      console.log('Error websocket send:', error);
    }
  }

  send(event: Events, ...args: any[]): void {
    try {
      this.pio.emit(event, args);
    } catch (error) {
      console.log('Error websocket send:', error);
    }
  }
}
