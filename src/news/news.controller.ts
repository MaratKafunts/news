import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateNewsDto } from './dto/news-create.dto';
import { NewsService } from './news.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('createNews')
  createNews(@Body() dto: CreateNewsDto) {
    return this.newsService.createNews(dto);
  }
}
