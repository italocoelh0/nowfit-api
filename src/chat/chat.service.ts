import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import { PrismaService } from 'src/prisma.service';
// FIX: 'Prisma' was not defined. It is now imported from '@prisma/client'.
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  create(createMessageDto: CreateMessageDto & { senderId: string }) {
    return this.prisma.directMessage.create({
      data: createMessageDto,
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.directMessage.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
