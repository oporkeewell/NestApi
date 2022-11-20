import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async profile(@Request() req: any) {
    return { payload: req.user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/order')
  async order(@Request() req: any) {
    return this.usersService.viewOrder(req);
  }
}
