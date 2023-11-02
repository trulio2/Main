import { Body, Controller, Post, Session, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionType, User } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(
    @Body('username') userName: string,
    @Session() session: SessionType,
  ): Promise<User> {
    const user = await this.authService.signin(userName);

    session.userId = user.userId;
    session.userName = user.userName;

    return user;
  }

  @Post('signup')
  async signup(
    @Body('username') userName: string,
    @Session() session: SessionType,
  ): Promise<User> {
    const user = await this.authService.signup(userName);

    session.userId = user.userId;
    session.userName = user.userName;

    return user;
  }

  @Get('signout')
  signout(@Session() session: SessionType): string {
    session.userId = null;
    session.userName = null;

    return 'You have been signed out';
  }
}
