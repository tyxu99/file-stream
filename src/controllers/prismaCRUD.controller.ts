import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

// import { Post as any, User as any, Prisma } from '@prisma/client';

@Controller()
export class PrismaCRUDController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<any> {
    return this.prismaService.post.findUnique({ where: { id: Number(id) } });
  }

  @Get('feed')
  async getFilteredPosts(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ): Promise<any[]> {
    const or = searchString
      ? {
          OR: [
            { title: { contains: searchString } },
            { content: { contains: searchString } },
          ],
        }
      : {};
    return this.prismaService.post.findMany({
      where: {
        published: true,
        ...or,
      },
      include: { author: true },
      take: Number(take) || undefined,
      skip: Number(take) || undefined,
      orderBy: {
        updateAt: orderBy,
      },
    });
  }

  @Get('users')
  async getAllUsers(): Promise<any[]> {
    return this.prismaService.user.findMany();
  }

  @Get('user/:id/drafts')
  async getDraftByUser(@Param('id') id: string): Promise<any[]> {
    return this.prismaService.user
      .findUnique({
        where: { id: Number(id) },
      })
      .posts({
        where: {
          published: false,
        },
      });
  }

  @Post('post')
  async createDraft(
    @Body() postData: { title: string; content?: string; authorEmail: string },
  ): Promise<any> {
    const { title, content, authorEmail } = postData;
    return this.prismaService.post.create({
      data: {
        title,
        content,
        author: {
          connect: { email: authorEmail },
        },
      },
    });
  }

  @Post('signup')
  async signupUser(
    @Body()
    userData: {
      name?: string;
      email: string;
      posts?: any[];
    },
  ): Promise<any> {
    const postData = userData.posts.map((post) => ({
      title: post?.title,
      content: post?.content,
    }));
    return this.prismaService.user.create({
      data: {
        name: userData?.name,
        email: userData.email,
        posts: {
          create: postData,
        },
      },
    });
  }

  @Put('publish/:id')
  async togglePublishPost(@Param('id') id: string): Promise<any> {
    const postData = await this.prismaService.post.findUnique({
      where: { id: Number(id) },
      select: {
        published: true,
      },
    });
    return this.prismaService.post.update({
      where: { id: Number(id) || undefined },
      data: { published: !postData?.published },
    });
  }

  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<any> {
    return this.prismaService.post.delete({ where: { id: Number(id) } });
  }

  @Put('/post/:id/views')
  async incrementPostViewCount(@Param('id') id: string): Promise<any> {
    return this.prismaService.post.update({
      where: { id: Number(id) },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }
}
