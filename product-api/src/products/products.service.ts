import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { Product, ProductDocument } from 'src/model/product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findByName(name: string): Promise<Product> {
    return await this.productModel.findOne({ name });
  }

  async findById(id: any): Promise<Product> {
    return await this.productModel.findById(id);
  }

  async viewById(id: any) {
    const data = await this.findById(id);
    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }
    return {
      payload: data,
    };
  }

  async all(): Promise<Product[]> {
    return await this.productModel.find();
  }

  async create(createProductDto: CreateProductDto) {
    const { name, price } = createProductDto;
    const chkdata = await this.findByName(name);
    if (chkdata) {
      throw new HttpException(
        'name is already in use.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.productModel.create({ name, price });
    return { message: 'created successfully' };
  }
}
