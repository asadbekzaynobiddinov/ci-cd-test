import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Foydalanuvchi ismi', example: 'Ali' })
  @IsString()
  readonly first_name: string;

  @ApiProperty({ description: 'Foydalanuvchi familyasi', example: 'Valiyev' })
  @IsString()
  readonly last_name: string;

  @ApiProperty({
    description: 'Foydalanuvchi emaili',
    example: 'valiyev@gmail.com',
  })
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'Foydalanuvchi paroli', example: 'Valiyev007' })
  @IsString()
  readonly password: string;
}
