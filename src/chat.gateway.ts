import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

function makeMessage(event: string, data: string) {
  return JSON.stringify({ event, data });
}

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private static readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    ChatGateway.logger.debug(`Socket Server Init Complete`);
  }

  async handleConnection(client: Socket) {
    client['nickname'] = 'Anonymous';

    ChatGateway.logger.debug(
      `${client.id}(${client.handshake.query['username']}) is connected!`,
    );
    client.send(makeMessage('message', `Hello!`));
  }
  async handleDisconnect() {
    console.log('Disconnected from the Brower.');
  }

  @SubscribeMessage('enter_room')
  async handleRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    client.join(payload.data);

    return '[OK] Joined room!';
    // return 시켜서 client의 ack function을 실행시킬 수 있다.
  }

  // @SubscribeMessage('message')
  // handleMessage(
  //   @ConnectedSocket() client: any,
  //   @MessageBody() payload: string,
  // ) {
  //   this.sockets.forEach((socket) => {
  //     if (socket.id != client.id)
  //       socket.send(makeMessage('message', `${client.nickname} : ${payload}`));
  //   });
  // }

  // @SubscribeMessage('nick')
  // handleNick(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: string,
  // ) {
  //   client['nickname'] = payload;
  // }
}
