import { Injectable } from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto, userId: string) {
    const { location, ...rest } = createEventDto;
    return this.prisma.event.create({
      data: {
        ...rest,
        city: location.city,
        state: location.state,
        creatorId: userId,
      },
    });
  }

  async findAll() {
    const events = await this.prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        participants: {
          select: { userId: true },
        },
      },
    });
    return events.map(event => ({
      ...event,
      participantIds: event.participants.map(p => p.userId),
    }));
  }

  async joinEvent(eventId: number, userId: string) {
    const existingParticipation = await this.prisma.eventParticipant.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existingParticipation) {
      await this.prisma.eventParticipant.delete({ where: { id: existingParticipation.id } });
      return { joined: false };
    } else {
      await this.prisma.eventParticipant.create({ data: { userId, eventId } });
      return { joined: true };
    }
  }

  async getComments(eventId: number) {
    return this.prisma.eventComment.findMany({
      where: { eventId },
      include: {
        user: { select: { name: true, userAvatar: true } },
      },
    });
  }

  async addComment(eventId: number, text: string, userId: string) {
    return this.prisma.eventComment.create({
      data: {
        text,
        eventId,
        userId,
      },
      include: {
        user: { select: { name: true, userAvatar: true } },
      },
    });
  }
}
