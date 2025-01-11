import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/utils/bcrypt';
import { IResponseMessage } from 'src/utils/response.message';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<IResponseMessage> {
    const userExists: Array<CreateUserDto> = await this.userModel.find({
      email: createUserDto.email,
    });

    if (userExists.length > 0) {
      return {
        success: false,
        status: 409,
        message: 'Email already exists',
      };
    }

    const newUser = new this.userModel(createUserDto);
    newUser.password = await hashPassword(newUser.password);

    await newUser.save();
    const userObject = newUser.toObject();

    delete userObject.password;
    return {
      success: true,
      status: 201,
      message: userObject,
    };
  }

  async findAll(page: number, limit: number): Promise<IResponseMessage> {
    // throw new Error('Custom error');
    const skip = (page - 1) * limit;
    const users = await this.userModel.find().skip(skip).limit(limit);
    if (users.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'Users not found',
      };
    }
    return {
      success: true,
      status: 200,
      message: users,
    };
  }

  async findOne(id: string): Promise<IResponseMessage> {
    const user: Array<CreateUserDto> = await this.userModel.findById(id);

    if (user.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'Users not found',
      };
    }
    return {
      success: true,
      status: 200,
      message: user,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IResponseMessage> {
    const updatedUser: UpdateUserDto = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .select('-password');
    if (!updatedUser || updatedUser == null) {
      return {
        success: false,
        status: 404,
        message: 'User not found',
      };
    }
    return {
      success: true,
      status: 200,
      message: updatedUser,
    };
  }

  async remove(id: string): Promise<IResponseMessage> {
    const deletedUser: CreateUserDto = await this.userModel
      .findByIdAndDelete(id)
      .select('-password');
    if (!deletedUser || deletedUser == null) {
      return {
        success: false,
        status: 404,
        message: 'User not found',
      };
    }
    return {
      success: true,
      status: 200,
      message: deletedUser,
    };
  }
}
