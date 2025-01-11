import { IsEmail, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
  @ApiProperty({
    description: 'Foydalanuvchi emaili',
    example: 'test@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'emailga yuborilgan otp kodi',
    example: '457834',
  })
  @IsPositive()
  otp: number;
}
