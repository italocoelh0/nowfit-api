import { Injectable } from '@nestjs/common';
import { DirectMessage } from '../types';

@Injectable()
export class MessagesService {
  private readonly messages: DirectMessage[] = [];

  create(messageData: {
    senderId: string;
    receiverId: string;
    text?: string;
    audioUrl?: string;
  }): DirectMessage {
    const newMessage: DirectMessage = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...messageData,
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  findAllForUser(userId: string): DirectMessage[] {
    return this.messages.filter(
      (m) => m.senderId === userId || m.receiverId === userId,
    );
  }
}
