import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';

@Controller('post')
export class PostController {
constructor(private readonly postService:PostService){}

@Post()
   async create(
     
      @Body() data: { title: string; content: string }) {

      return await this.postService.create();
    }

    @Get('query')
    async query(){
      return await this.postService.query();
    }
    @Get("list")
    async list(){
      return this.postService.list()
    }
    @Delete('delete/:id')
    async softDelete(@Param('id') id: number){
     const postId = Number(id);
      return this.postService.softDelete(postId)
    }
    @Put('delete/:id')
    async restore(@Param('id') id: number){
     const postId = Number(id);
      return this.postService.restore(postId)
    }

}
 