import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard, RoleGuard } from 'src/middlewares';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'MySupperSecretKey',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard, RoleGuard],
})
export class UsersModule {}
