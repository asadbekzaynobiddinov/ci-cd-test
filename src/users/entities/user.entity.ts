import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Prop({ default: false })
  is_active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
