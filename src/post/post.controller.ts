import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
    
}
