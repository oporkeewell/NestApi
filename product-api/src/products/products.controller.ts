import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async view() {
    return { payload: await this.productsService.all() };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async viewById(@Param('id') id: string) {
    return this.productsService.viewById(id);
  }
}
