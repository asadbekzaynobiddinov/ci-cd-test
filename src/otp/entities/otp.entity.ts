import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Otp extends Document {
  @Prop({ required: true })
  user_email: string;

  @Prop({ required: true })
  otp: number;

  @Prop()
  expires_in: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
