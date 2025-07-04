import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/news-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schema/news.schema';
import { Model } from 'mongoose';
import { UpdateNewsDto } from './dto/news-update.dto';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<News>) {}

  async create(dto: CreateNewsDto) {
    const createdNews = new this.newsModel({
      title: dto.title,
      content: dto.content,
    });
    return createdNews.save();
  }

  async update(id: string, dto: UpdateNewsDto) {
    const news = await this.newsModel.findById(id);
    if (!news) {
      throw new NotFoundException('News not found');
    }

    if (dto.title !== undefined) news.title = dto.title;
    if (dto.content !== undefined) news.content = dto.content;

    await news.save();
    return news;
  }

  async delete(id: string) {
    const news = await this.newsModel.findById(id);
    if (!news) {
      throw new NotFoundException('News not found');
    }

    await this.newsModel.findByIdAndDelete(id);

    return { message: 'News deleted successfully' };
  }
}
