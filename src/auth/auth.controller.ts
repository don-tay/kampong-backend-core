import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import AuthService from './auth.service';
import { UserLoginDTO } from './dtos/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() userLoginDTO: UserLoginDTO) {
    return this.authService.login(userLoginDTO);
  }
}
