import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/news-create.dto';
import { NewsService } from './news.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateNewsDto } from './dto/news-update.dto';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('create')
  create(@Body() dto: CreateNewsDto) {
    return this.newsService.create(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.newsService.delete(id);
  }
}
