import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AppService } from './app.service';
import { User } from './dto';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,

    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    console.log('gateway', id);
    const user = await this.appService.getUser(id);

    console.log(user);

    return user;
  }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('get_user');
  }
}
