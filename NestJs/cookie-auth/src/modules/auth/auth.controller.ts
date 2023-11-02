import { Body, Controller, Post, Session, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionType, User } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(
    @Body('username') userName: string,
    @Session() session: SessionType,
  ): User {
    const user = this.authService.signin(userName);

    session.userId = user.userId;
    session.userName = user.userName;

    return user;
  }

  @Post('signup')
  signup(
    @Body('username') userName: string,
    @Session() session: SessionType,
  ): User {
    const user = this.authService.signup(userName);

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
