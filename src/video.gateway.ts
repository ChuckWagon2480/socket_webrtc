import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(0, {
  transports: ['websocket'],
  namespace: 'video',
})
export class VideoGateway implements OnGatewayInit, OnGatewayConnection {
  private static readonly logger = new Logger(VideoGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    VideoGateway.logger.debug(`Socket Server Init Complete`);
  }

  async handleConnection(socket: Socket) {
    socket.onAny((event) => {
      console.log(`Socket event : ${event}`);
    });
  }

  @SubscribeMessage('join_room')
  handleJoin(socket: Socket, payload: any) {
    const { roomName } = payload;
    socket.join(roomName);
    socket.to(roomName).emit('welcome');
  }

  @SubscribeMessage('offer')
  handleOffer(socket: Socket, payload: any) {
    const { offer, roomName } = payload;
    socket.to(roomName).emit('offer', offer);
  }

  @SubscribeMessage('answer')
  handleAnswer(socket: Socket, payload: any) {
    const { answer, roomName } = payload;
    socket.to(roomName).emit('answer', answer);
  }

  @SubscribeMessage('ice')
  handleIce(socket: Socket, payload: any) {
    const { ice, roomName } = payload;
    socket.to(roomName).emit('ice', ice);
  }
}
