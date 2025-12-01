import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser('id') userId: string) {
    var resultNewPost = this.postsService.create(createPostDto, userId);
    return resultNewPost;
  }

  @Get()
  findAll() {
    const posts = this.postsService.findAll();
    return posts;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @GetUser('id') userId: string) {
    return this.postsService.update(+id, updatePostDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.postsService.remove(+id, userId);
  }

  @Post(':id/like')
  likePost(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.postsService.likePost(+id, userId);
  }

  @Post(':id/flame')
  giveFlame(@Param('id') id: string, @GetUser('id') giverId: string) {
    return this.postsService.giveFlame(+id, giverId);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto, @GetUser('id') userId: string) {
    return this.postsService.addComment(+id, createCommentDto.text, userId);
  }
}
