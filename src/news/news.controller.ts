import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/news-create.dto';
import { NewsService } from './news.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UpdateNewsDto } from './dto/news-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Some title' },
        content: { type: 'string', example: 'Some content' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  create(
    @Body() dto: CreateNewsDto,
    @UploadedFile() image: Express.Multer.File,
    @Headers('google-access-token') accessToken: string,
  ) {
    return this.newsService.create(dto, image, accessToken);
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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('getAll')
  getAllNews() {
    return this.newsService.getAllNews();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('getOne/:id')
  getOneNews(@Param('id') id: string) {
    return this.newsService.getOneNews(id);
  }
}
