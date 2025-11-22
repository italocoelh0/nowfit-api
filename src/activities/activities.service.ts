import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { PrismaService } from 'src/prisma.service';
import { RecordedActivity } from 'src/types';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createActivityDto: CreateActivityDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { activities: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newActivity: RecordedActivity = {
      ...createActivityDto,
      id: `activity_${Date.now()}`,
      date: new Date().toISOString(),
    };

    const currentActivities = (user.activities as RecordedActivity[] | null) || [];
    const updatedActivities = [newActivity, ...currentActivities];

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        activities: JSON.stringify(updatedActivities),
      },
    });
  }
}
