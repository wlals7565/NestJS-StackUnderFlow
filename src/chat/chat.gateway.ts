import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { User } from 'src/common/types/user.type';

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const messages = this.chatService.getRecentMessages();
    client.emit('chatHistory', messages);
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const user: User & { color: string } = this.chatService.removeUser(
      client.id,
    );
    if (user) {
      this.server.emit('userLeft', {
        userId: user.uuid,
        userName: user.username,
      });
      console.log(`User disconnected: ${user.username} (${client.id})`);
    }
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() userData: User) {
    // 유저 관리를 위해 map에 추가
    const user: User & { color: string } = this.chatService.addUser(
      client.id,
      userData,
    );
    console.log(user);
    const systemMessage = this.chatService.createSystemMessage(
      `${user.username}님이 입장하셨습니다.`,
    );
    this.server.emit('chatHistory', this.chatService.getRecentMessages());
    this.server.emit('userJoined', user);
    this.server.emit('systemMessage', systemMessage);
    return { status: 'success', user };
  }

  @SubscribeMessage('sendMessage') handleMessage(
    client: Socket,
    payload: { text: string },
  ) {
    const user = this.chatService.getUser(client.id);
    if (!user) {
      return { status: 'error', message: '사용자 인증 필요' };
    }
    const message = this.chatService.createMessage(user, payload.text);
    this.chatService.addMessage(message);
    this.server.emit('message', message);
    return { status: 'success' };
  }

  @SubscribeMessage('getUsers') handleGetUsers() {
    const users = this.chatService.getAllUsers();
    return { users };
  }
}
