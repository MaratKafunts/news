import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/news-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schema/news.schema';
import { Model } from 'mongoose';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<News>) {}
  async createNews(dto: CreateNewsDto) {
    const createdNews = new this.newsModel({
      title: dto.title,
      content: dto.content,
    });
    return createdNews.save();
  }
}
