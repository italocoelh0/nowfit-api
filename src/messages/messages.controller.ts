import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(
    @Body()
    createMessageDto: {
      receiverId: string;
      text?: string;
      audioUrl?: string;
    },
    @Request() req,
  ) {
    const senderId = req.user.userId;
    return this.messagesService.create({ ...createMessageDto, senderId });
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.messagesService.findAllForUser(userId);
  }
}
