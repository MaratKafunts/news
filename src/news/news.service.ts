/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/news-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schema/news.schema';
import { Model } from 'mongoose';
import { UpdateNewsDto } from './dto/news-update.dto';
import { google } from 'googleapis';
// import { serviceAccount } from 'src/credentials/credentials';
import { Readable } from 'stream';
@Injectable()
export class NewsService {
  // private driveClient: any;

  constructor(@InjectModel(News.name) private newsModel: Model<News>) {
    // const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
    //   credentials: serviceAccount,
    //   scopes: ['https://www.googleapis.com/auth/drive'],
    // });
    // this.driveClient = google.drive({
    //   version: 'v3',
    //   auth: auth,
    // });
  }

  // async create(
  //   dto: CreateNewsDto,
  //   image: Express.Multer.File,
  //   accessToken: string,
  // ) {
  //   const oauth2Client = new google.auth.OAuth2();
  //   oauth2Client.setCredentials({ access_token: accessToken });

  //   const drive = google.drive({ version: 'v3', auth: oauth2Client });

  //   const fileMetadata = {
  //     name: image.originalname,
  //     mimeType: image.mimetype,
  //     parents: ['1--V8iStQ3XTqH8qinAlTooyf72zjV29G'],
  //   };

  //   const media = {
  //     mimeType: image.mimetype,
  //     body: bufferToStream(image.buffer),
  //   };

  //   const resp = await this.driveClient.files.create({
  //     requestBody: fileMetadata,
  //     media,
  //     fields: 'id, webViewLink',
  //     supportsAllDrives: true,
  //   });

  //   const createdNews = new this.newsModel({
  //     title: dto.title,
  //     content: dto.content,
  //     driveFileId: resp.data.id,
  //     imageUrl: resp.data.webViewLink,
  //   });

  //   return createdNews.save();
  // }
  async create(
    dto: CreateNewsDto,
    image: Express.Multer.File,
    accessToken: string,
  ) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fileMetadata = {
      name: image.originalname,
      mimeType: image.mimetype,
      parents: ['1--V8iStQ3XTqH8qinAlTooyf72zjV29G'],
    };

    const media = {
      mimeType: image.mimetype,
      body: bufferToStream(image.buffer),
    };

    const resp = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, webViewLink',
    });

    const createdNews = new this.newsModel({
      title: dto.title,
      content: dto.content,
      driveFileId: resp.data.id,
      imageUrl: resp.data.webViewLink,
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

  async getAllNews() {
    return await this.newsModel.find().exec();
  }

  async getOneNews(id: string) {
    const news = await this.newsModel.findById(id);
    if (!news) {
      throw new NotFoundException('News not found');
    }

    return {
      message: 'News was found',
      news,
    };
  }
}

function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}
