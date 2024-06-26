import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './constants';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>, @Res() res) {
    const response = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    res.cookie('access_token', response, { httpOnly: true });
    return res.sendStatus(200);
  }

  @Roles(Role.Admin)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('logout')
  logout(@Res() res) {
    res.clearCookie('access_token');
    return res.sendStatus(200);
  }
}
