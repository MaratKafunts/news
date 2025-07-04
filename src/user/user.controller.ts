import { Body, Controller, Delete, Patch, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch('update/:id')
  update(id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('delete/:id')
  delete(id: string) {
    return this.userService.delete(id);
  }
}
