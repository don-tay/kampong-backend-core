import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserLoginReqDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async login(UserLoginReqDto: UserLoginReqDto) {
    const loginUser = await this.userModel.findOne({
      username: UserLoginReqDto.username,
    });
    if (!loginUser) {
      throw new Error('User does not exist');
    }
    const isEqual = await this.checkPassword(
      UserLoginReqDto.password,
      UserLoginReqDto.password,
    );
    if (!isEqual) {
      throw new Error('Password is incorrect');
    }
    const token = this.getSignedJwtToken(loginUser);
    return {
      userId: loginUser._id,
      token: token,
      tokenExpiration: process.env.JWT_EXPIRE,
    };
  }

  private getSignedJwtToken(loginUser) {
    sign(
      { userId: loginUser._id, userEmail: loginUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      },
    );
  }

  private async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  private checkPassword(inputPassword: string, originalPassword: string) {
    return bcrypt.compare(inputPassword, originalPassword);
  }
}

export default AuthService;
