import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    type: mongoose.Schema.Types.String,
    trim: true,
    minlength: 6,
    unique: true,
  })
  username: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    trim: true,
    minlength: 6,
  })
  password: string;

  @Prop({
    type: [mongoose.Schema.Types.String],
    default: undefined,
  })
  role: string[];

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 1,
  })
  status: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
