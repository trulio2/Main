import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { GetUserDto } from './dto';
import { User } from './entities';

@Controller()
export class AuthController implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,

    @Inject('CATS_SERVICE') private readonly catsClient: ClientKafka,
  ) {}

  @MessagePattern('get_user')
  async getUser(getUserDto: GetUserDto): Promise<User> {
    console.log('auth', getUserDto);
    const user = await this.authService.getUser(getUserDto);

    console.log(user);

    return user;
  }

  onModuleInit() {
    this.catsClient.subscribeToResponseOf('get_cat');
  }
}
