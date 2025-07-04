/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email !== undefined) {
      user.email = dto.email;
    }
    if (dto.password !== undefined) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(dto.password, salt);
    }

    await user.save();
    return {
      message: 'User updated successfully',
      user: {
        id: user._id,
        email: user.email,
        password: user.password,
      },
    };
  }

  async delete(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.findByIdAndDelete(id);

    return { message: 'User deleted successfully' };
  }
}
