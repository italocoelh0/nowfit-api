import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { CreateEventCommentDto } from '../dto/create-event-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto, @GetUser('id') userId: string) {
    return this.eventsService.create(createEventDto, userId);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Post(':id/join')
  joinEvent(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.eventsService.joinEvent(+id, userId);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.eventsService.getComments(+id);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateEventCommentDto,
    @GetUser('id') userId: string,
  ) {
    return this.eventsService.addComment(+id, createCommentDto.text, userId);
  }
}
