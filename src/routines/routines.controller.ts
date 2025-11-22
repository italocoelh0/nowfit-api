import { Controller, Get, Put, Body, Delete, UseGuards } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { UpdateRoutineDto } from '../dto/update-routine.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Get()
  findUserRoutine(@GetUser('id') userId: string) {
    return this.routinesService.findUserRoutine(userId);
  }
  
  @Put()
  updateUserRoutine(@GetUser('id') userId: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routinesService.updateUserRoutine(userId, updateRoutineDto);
  }

  @Delete()
  resetUserRoutine(@GetUser('id') userId: string) {
    return this.routinesService.resetUserRoutine(userId);
  }
}
