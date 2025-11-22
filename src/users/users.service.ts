import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        userAvatar: true,
        isVerified: true,
        followers: {
          select: {
            followerId: true,
          },
        },
        following: {
          select: {
            followingId: true,
          },
        },
      },
    });

    return users.map((user) => {
      const { followers, following, ...rest } = user;
      return {
        ...rest,
        followerIds: followers.map((f) => f.followerId),
        followingIds: following.map((f) => f.followingId),
      };
    });
  }

  async checkUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    return { exists: !!user };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.followingIds) {
      delete updateUserDto.followingIds;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...result } = user;
    return result;
  }
}