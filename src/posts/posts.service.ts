import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

async create(createPostDto: CreatePostDto, userId: string) {
  
  const {
      content,
      imageUrl,
      videoUrl,
      isPriority,
      originalPostId,
    } = createPostDto as any;

    if (!content) {
      throw new BadRequestException('Erro na leitura de dados do post');
    }

    const newPostWithAuthor = await (this.prisma as any).post.create({
      data: {
        content,
        imageUrl,
        videoUrl,
        isPriority,
        originalPostId,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, userAvatar: true, isVerified: true },
        },
      },
    });

    const { author, ...restOfPost } = newPostWithAuthor;

    // Garante que o objeto retornado tenha a mesma "forma" do que a lista de posts
    return {
      ...restOfPost,
      userId: author.id,
      userName: author.name,
      username: author.username,
      userAvatar: author.userAvatar,
      authorIsVerified: author.isVerified,
      likedByUserIds: [], // Novo post começa com 0 curtidas
      flamedByUserIds: [], // Novo post começa com 0 flames
      comments: [], // Novo post começa com 0 comentários
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

    return posts.map(post => ({
      ...post,
      userId: post.author.id,
      userName: post.author.name,
      username: post.author.username,
      userAvatar: post.author.userAvatar,
      authorIsVerified: post.author.isVerified,
      likedByUserIds: post.likes.map(like => like.userId),
      flamedByUserIds: post.flames.map(flame => flame.userId),
      timestamp: post.createdAt.toISOString(),
    }));
  }
  
  async update(id: number, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.findPostAndCheckOwnership(id, userId);
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
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
