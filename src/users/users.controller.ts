import { Controller, Get, Body, Patch, Param, UseGuards, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('check-username')
  checkUsername(@Query('username') username: string) {
    return this.usersService.checkUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser('id') currentUserId: string,
  ) {
    // Ensure user can only update their own profile
    if (id !== currentUserId) {
      // Or handle authorization differently (e.g., admin roles)
      throw new Error('You can only update your own profile.');
    }
    return this.usersService.update(id, updateUserDto);
  }
}
