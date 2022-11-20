import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type OrderDocument = Order & Document;
//export type OrderDocument = mongoose.HydratedDocument<Order>;
@Schema()
class Product {
  id: string;
  qty: number;
}
@Schema()
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  userid: string;

  @Prop({
    type: mongoose.Schema.Types.Array,
    default: undefined,
  })
  product: Product[];

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 1,
  })
  status: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
