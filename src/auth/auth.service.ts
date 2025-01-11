import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { hashPassword, comparePassword } from 'src/utils/bcrypt';
import { IResponseMessage } from 'src/utils/response.message';
import { MailService } from './mail.service';
import { generateOtp } from 'src/utils/otp';
import { OtpService } from 'src/otp/otp.service';
import { CreateOtpDto } from 'src/otp/dto/create-otp.dto';

interface ILoginMessage extends IResponseMessage {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}
  async register(user: CreateUserDto): Promise<IResponseMessage> {
    const userExists: Array<CreateUserDto> = await this.userModel.find({
      email: user.email,
    });

    if (userExists.length > 0) {
      return {
        success: false,
        status: 409,
        message: 'Email already exists',
      };
    }

    const newUser = new this.userModel(user);
    newUser.password = await hashPassword(newUser.password);

    const otp = generateOtp();
    const newOtp: CreateOtpDto = {
      user_email: newUser.email,
      otp: +otp,
      expires_in: new Date(Date.now() + 10 * 60 * 1000),
    };

    await this.otpService.create(newOtp);
    await newUser.save();

    this.mailService.sendMail(newUser.email, 'OTP', otp);

    return {
      success: true,
      status: 201,
      message: `${newUser.email} ga otp kod jo'natildi`,
    };
  }

  async login(user: CreateAuthDto): Promise<ILoginMessage> {
    const foundUser = await this.userModel.findOne({ email: user.email });
    if (!foundUser || foundUser == null) {
      return {
        success: false,
        status: 400,
        message: 'Email or password incorrect',
        accessToken: '',
        refreshToken: '',
      };
    }

    const passwordEqual = await comparePassword(
      user.password,
      foundUser.password,
    );
    if (!passwordEqual) {
      return {
        success: false,
        status: 400,
        message: 'Email or password incorrect',
        accessToken: '',
        refreshToken: '',
      };
    }
    const payload = {
      userId: foundUser._id,
      email: foundUser.email,
      role: foundUser.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      success: true,
      status: 200,
      message: 'Congratulations',
      accessToken,
      refreshToken,
    };
  }

  async verify(email: string, otp: number): Promise<string> {
    const otpRecord = await this.otpService.find(otp);

    if (!otpRecord) {
      throw new NotFoundException('Otp topilmadi');
    }

    if (Date.now() > otpRecord.expires_in.getTime()) {
      await this.otpService.delete(otpRecord._id.toString());
      await this.userModel.deleteOne({ email: otpRecord.user_email });
      throw new UnauthorizedException('Otp eskirgan');
    }

    if (otpRecord.otp != otp) {
      throw new UnauthorizedException('Otp kodi mos emas');
    }

    const currentUser = await this.userModel.findOne({ email });
    currentUser.is_active = true;
    await currentUser.save();

    await this.otpService.delete(otpRecord._id.toString());

    return 'User is active';
  }
}
