import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Foydalanuvchi emaili',
    example: 'test@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Foydalanuvchi paroli', example: 'parol' })
  @IsString()
  password: string;
}
