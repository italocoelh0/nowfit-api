import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRoutineDto } from '../dto/update-routine.dto';
import { PrismaService } from 'src/prisma.service';
import { UserRoutine } from 'src/types';
// FIX: 'Prisma' was not defined. It is now imported from '@prisma/client'.
import { Prisma } from '@prisma/client';

@Injectable()
export class RoutinesService {
  constructor(private prisma: PrismaService) {}

  async findUserRoutine(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { routine: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.routine;
  }
  
  async updateUserRoutine(userId: string, updateRoutineDto: UpdateRoutineDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        routine: JSON.stringify(updateRoutineDto as unknown as UserRoutine),
      },
    });
  }

  async resetUserRoutine(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        routine: Prisma.JsonNull,
      },
    });
  }
}
