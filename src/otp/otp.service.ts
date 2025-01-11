import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from './entities/otp.entity';
import { Model } from 'mongoose';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp.name) private readonly otp: Model<Otp>) {}
  async create(createOtpDto: CreateOtpDto) {
    const newOtp = new this.otp(createOtpDto);
    await newOtp.save();
  }

  async find(otp: number) {
    return await this.otp.findOne({ otp });
  }

  async delete(id: string) {
    await this.otp.findByIdAndDelete(id);
  }
}
