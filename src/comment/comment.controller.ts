import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { GetUser } from '../users/user.decorator';
import { User } from '../users/user.entity';
import { Article } from '../article/article.entity';
import { AuthGuard } from '@nestjs/passport';
import { AddCommentDto } from './dto/add-comment.dto';
import { ArticleData } from '../article/article.data';
import { CommentData } from './comment.data';
import { TransformClassToPlain } from 'class-transformer';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':articleSlug')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Param('articleSlug') slug: string,
    @GetUser() user: User,
    @Body() addCommentDto: AddCommentDto,
  ): Promise<CommentData> {
    return await this.commentService.create(slug, user.id, addCommentDto);
  }

  @Get(':articleSlug')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @TransformClassToPlain()
  async findAll(@Param('articleSlug') slug: string): Promise<Comment[]> {
    return await this.commentService.findAll(slug);
  }
}
