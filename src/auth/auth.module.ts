import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'MySupperSecretKey',
    }),
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}
