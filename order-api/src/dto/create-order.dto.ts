import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
class ProductDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  qty: number;
}

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  product: ProductDto[];
}
