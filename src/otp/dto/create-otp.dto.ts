import { IsEmail, IsOptional, IsPositive } from 'class-validator';

export class CreateOtpDto {
  @IsEmail()
  user_email: string;

  @IsPositive()
  otp: number;

  @IsOptional()
  expires_in: Date;
}
