import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0,
  })
  price: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 1,
  })
  status: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
