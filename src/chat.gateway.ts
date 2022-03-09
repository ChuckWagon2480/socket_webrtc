import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(0, {
  transports: ['websocket'],
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private static readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    ChatGateway.logger.debug(`Socket Server Init Complete`);
  }

  async handleConnection(socket: Socket) {
    socket.data.nick = 'Unknown';
    socket.onAny((event) => {
      console.log(`Socket event : ${event}`);
    });

    socket.on('disconnecting', () => {
      // @SubscribeMessage('disconnecting')에서는 이미 rooms가 비워진 상태이다.
      console.log(socket.rooms);
      socket.rooms.forEach((room) => {
        socket.to(room).emit('bye', { nick: socket.data.nick });
      });
    });

    ChatGateway.logger.debug(`${socket.id}(${socket.data.nick}) is connected!`);
  }
  async handleDisconnect(socket: Socket) {
    ChatGateway.logger.debug(
      `${socket.id}(${socket.data.nick}) is disconnected!`,
    );
  }

  @SubscribeMessage('enter_room')
  async handleRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: any,
  ) {
    const roomName = payload.data;
    socket.to(roomName).emit('welcome', { nick: socket.data.nick });
    socket.join(roomName);

    return '[OK] Joined room!';
    // return 시켜서 client의 ack function을 실행시킬 수 있다.
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: any, @MessageBody() payload: any) {
    const { message, roomName } = payload;
    socket
      .to(roomName)
      .emit('message', { nick: socket.data.nick, message: message });
  }

  @SubscribeMessage('nick')
  handleNick(@ConnectedSocket() socket: Socket, @MessageBody() payload: any) {
    const { nick } = payload;
    socket.data.nick = nick;
  }
}
