import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @GetUser('id') senderId: string) {
    return this.chatService.create({ ...createMessageDto, senderId });
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.chatService.findAllForUser(userId);
  }
}
