/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schema/auth.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async register(dto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const createdUser = new this.userModel({
      email: dto.email,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async login(dto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (user?.email !== process.env.ADMIN_EMAIL) {
      throw new UnauthorizedException('Wrong email');
    }

    if (!process.env.ADMIN_PASSWORD) {
      throw new UnauthorizedException('Admin password is not set');
    }
    if (!user?.password) {
      throw new UnauthorizedException('User password is not set');
    }
    const isPasswordValid = bcrypt.compare(
      user.password,
      process.env.ADMIN_PASSWORD,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = { email: dto.email, sub: user?._id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '1h',
    });

    return {
      message: 'админ авторизован',
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const newAccessToken = this.jwtService.sign({
        sub: payload.sub,
        email: payload.email,
      });

      return { accessToken: newAccessToken };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }
}
