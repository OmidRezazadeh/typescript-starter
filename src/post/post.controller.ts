import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';

@Controller('post')
export class PostController {
constructor(private readonly postService:PostService){}
@UseGuards(JwtAuthGuard)   
@Post()
    create(
      @Req() req,
      @Body() data: { title: string; content: string }) {
     const userId =req.user.id 
      return this.postService.create(data,userId);
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
 