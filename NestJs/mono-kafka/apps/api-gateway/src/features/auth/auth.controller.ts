import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,

    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Post('signin')
  async signIn(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const token = await this.authService.signIn(createUserDto);

    return token;
  }

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const token = await this.authService.signUp(createUserDto);

    return token;
  }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('find_user');
    this.authClient.subscribeToResponseOf('signIn');
    this.authClient.subscribeToResponseOf('signUp');
  }
}
