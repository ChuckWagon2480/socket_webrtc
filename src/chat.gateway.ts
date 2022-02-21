import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

function makeMessage(event: string, data: string) {
  return JSON.stringify({ event, data });
}

@WebSocketGateway(8080)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  sockets = [];

  async handleConnection(socket: WebSocket) {
    socket['id'] = String(Number(new Date()));
    socket['nickname'] = 'Anonymous';
    this.sockets.push(socket);
    console.log('Connected to Server!');
    socket.send(
      makeMessage(
        'message',
        `Hello! Now ${this.sockets.length} members here!!`,
      ),
    );
  }
  async handleDisconnect() {
    console.log('Disconnected from the Brower.');
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: any,
    @MessageBody() payload: string,
  ) {
    this.sockets.forEach((socket) => {
      if (socket.id != client.id)
        socket.send(makeMessage('message', `${client.nickname} : ${payload}`));
    });
  }

  @SubscribeMessage('nick')
  handleNick(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() payload: string,
  ) {
    client['nickname'] = payload;
  }
}
