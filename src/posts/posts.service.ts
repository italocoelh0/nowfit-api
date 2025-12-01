import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private toBase64FromBytes(value: Buffer | Uint8Array | null | undefined) {
    if (!value) return null;
    const buf = Buffer.isBuffer(value) ? value : Buffer.from(value as any);
    return buf.toString('base64');
  }

  private mapPostBinaryToBase64(post: any) {
    return {
      ...post,
      imageUrl: this.toBase64FromBytes(post.imageUrl),
      videoUrl: this.toBase64FromBytes(post.videoUrl),
    };
  }

async create(createPostDto: CreatePostDto, userId: string) {
  const {
    content,
    isPriority,
    originalPostId,
    imageUrl,
    videoUrl,
  } = createPostDto;

  if (!content) {
    throw new BadRequestException('Erro na leitura de dados do post');
  }

  const data: any = {
    content,
    isPriority,
    originalPostId,
    authorId: userId,
  };

if (imageUrl !== undefined) {
  if (imageUrl === null || imageUrl === '') {
    data.imageUrl = null;
  } else if (typeof imageUrl === 'string') {
    data.imageUrl = Buffer.from(imageUrl, 'base64');
  }
}

if (videoUrl !== undefined) {
  if (videoUrl === null || videoUrl === '') {
    data.videoUrl = null;
  } else if (typeof videoUrl === 'string') {
    data.videoUrl = Buffer.from(videoUrl, 'base64');
  }
}

  const newPostWithAuthor = await this.prisma.post.create({
    data,
    include: {
      author: {
        select: { id: true, name: true, username: true, userAvatar: true, isVerified: true },
      },
    },
  });

  const { author, ...restOfPost } = newPostWithAuthor;

  return {
    ...restOfPost,
    userId: author.id,
    userName: author.name,
    username: author.username,
    userAvatar: author.userAvatar,
    authorIsVerified: author.isVerified,
    likedByUserIds: [],
    flamedByUserIds: [],
    comments: [],
    timestamp: restOfPost.createdAt.toISOString(),
  };
}

  async findAll() {
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, username: true, userAvatar: true, isVerified: true },
        },
        likes: { select: { userId: true } },
        flames: { select: { userId: true } },
        comments: {
          include: {
            user: { select: { id: true, name: true, userAvatar: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return posts.map(post => {
      const mapped = this.mapPostBinaryToBase64(post);
      return {
        ...mapped,
        userId: post.author.id,
        userName: post.author.name,
        username: post.author.username,
        userAvatar: post.author.userAvatar,
        authorIsVerified: post.author.isVerified,
        likedByUserIds: post.likes.map(like => like.userId),
        flamedByUserIds: post.flames.map(flame => flame.userId),
        timestamp: post.createdAt.toISOString(),
      };
    });
  }
  
 async update(id: number, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.findPostAndCheckOwnership(id, userId);
    const data: any = { ...updatePostDto };

    if ('imageUrl' in updatePostDto) {
      if (updatePostDto.imageUrl === null || updatePostDto.imageUrl === '') {
        data.imageUrl = { set: null };
      } else if (typeof updatePostDto.imageUrl === 'string') {
        data.imageUrl = { set: Buffer.from(updatePostDto.imageUrl, 'base64') };
      }
    }

    if ('videoUrl' in updatePostDto) {
      if (updatePostDto.videoUrl === null || updatePostDto.videoUrl === '') {
        data.videoUrl = { set: null };
      } else if (typeof updatePostDto.videoUrl === 'string') {
        data.videoUrl = { set: Buffer.from(updatePostDto.videoUrl, 'base64') };
      }
    }

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: string) {
    await this.findPostAndCheckOwnership(id, userId);
    return this.prisma.post.delete({ where: { id } });
  }

  async likePost(postId: number, userId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingLike) {
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      return { liked: false };
    } else {
      await this.prisma.like.create({ data: { userId, postId } });
      return { liked: true };
    }
  }

  async giveFlame(postId: number, giverId: string) {
    // This is a complex transaction
    return this.prisma.$transaction(async (tx) => {
      const giver = await tx.user.findUnique({ where: { id: giverId } });
      if (!giver || giver.flameBalance < 1) {
        throw new Error('Insufficient flame balance');
      }

      const post = await tx.post.findUnique({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      await tx.user.update({
        where: { id: giverId },
        data: { flameBalance: { decrement: 1 } },
      });

      await tx.user.update({
        where: { id: post.authorId },
        data: { flameBalance: { increment: 1 } },
      });

      await tx.flame.create({
        data: { userId: giverId, postId },
      });
      return { success: true };
    });
  }

  async addComment(postId: number, text: string, userId: string) {
    return this.prisma.comment.create({
      data: {
        text,
        postId,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, userAvatar: true } },
      },
    });
  }

  private async findPostAndCheckOwnership(id: number, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.authorId !== userId) {
      throw new UnauthorizedException('You do not own this post');
    }
    return post;
  }
}
