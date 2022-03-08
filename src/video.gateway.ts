import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8081, {
  transports: ['websocket'],
  namespace: 'video',
})
export class VideoGateway implements OnGatewayInit {
  private static readonly logger = new Logger(VideoGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    VideoGateway.logger.debug(`Socket Server Init Complete`);
  }
  @SubscribeMessage('join_room')
  handleJoin(socket: Socket, roomName: string) {
    socket.join(roomName);
    socket.to(roomName).emit('welcome');
  }

  @SubscribeMessage('offer')
  handleOffer(socket: Socket, offer: any, roomName: string) {
    socket.to(roomName).emit('offer', offer);
  }

  @SubscribeMessage('answer')
  handleAnswer(socket: Socket, answer: any, roomName: string) {
    socket.to(roomName).emit('answer', answer);
  }
}
