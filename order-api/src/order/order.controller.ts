import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from 'src/dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async viewByUser(@Request() req: any) {
    return this.orderService.viewByUser(req);
  }

  @Patch(':id')
  async cancel(@Param('id') id: string) {
    return this.orderService.cancel(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async viewById(@Param('id') id: string, @Request() req: any) {
    return this.orderService.viewById(id, req);
  }

 
}
