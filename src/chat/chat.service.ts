import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/common/types/user.type';

interface ChatMessage {
  id: string;
  text: string;
  createdAt: string;
  author: User & { color: string };
}

@Injectable()
export class ChatService {
  private messages: ChatMessage[] = [];
  private users: Map<string, User & { color: string }> = new Map();
  private readonly MAX_MESSAGES = 100;
  constructor() {
    this.messages.push(
      this.createSystemMessage('채팅방에 오신 것을 환영합니다!'),
    );
  }
  getRecentMessages(): ChatMessage[] {
    return [...this.messages].slice(-this.MAX_MESSAGES);
  }

  addMessage(message: ChatMessage): void {
    this.messages.push(message);
    if (this.messages.length > this.MAX_MESSAGES) {
      this.messages.shift();
    }
  }

  createMessage(user: User & { color: string }, text: string): ChatMessage {
    return {
      id: uuidv4(),
      text,
      createdAt: new Date().toISOString(),
      author: user,
    };
  }

  createSystemMessage(text: string): ChatMessage {
    return {
      id: uuidv4(),
      text,
      createdAt: new Date().toISOString(),
      author: {
        uuid: 'system',
        username: '시스템',
        color: '#6c757d',
        email: 'none',
      },
    };
  }

  // map객체에 유저 추가하기
  addUser(socketId: string, userData: User): User & { color: string } {
    const randomColors = [
      '#246BEB',
      '#28a745',
      '#dc3545',
      '#fd7e14',
      '#6f42c1',
      '#20c997',
      '#6c757d',
    ];
    const color = randomColors[Math.floor(Math.random() * randomColors.length)];
    const user: User & { color: string } = {
      ...userData,
      color,
    };
    this.users.set(socketId, user);
    return user;
  }

  // map 객체에서 유저 정보 가져오기
  getUser(socketId: string): (User & { color: string }) | undefined {
    return this.users.get(socketId);
  }

  // map 객체에서 유저 정보 삭제하기
  removeUser(socketId: string): (User & { color: string }) | undefined {
    const user = this.users.get(socketId);
    if (user) {
      this.users.delete(socketId);
    }
    return user;
  }
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}
