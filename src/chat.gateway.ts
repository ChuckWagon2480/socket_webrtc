import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

@WebSocketGateway(8080)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  sockets = [];

  async handleConnection(socket: WebSocket) {
    this.sockets.push(socket);
    console.log('Connected to Server!');
    socket.send(`Hello! Now ${this.sockets.length} members here!!`);
  }
  async handleDisconnect() {
    console.log('Disconnected from the Brower.');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.sockets.forEach((socket) => {
      socket.send(payload);
    });
  }
}
