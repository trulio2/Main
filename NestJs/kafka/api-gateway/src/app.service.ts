import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GetUser, User } from './dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  async getUser(id: string): Promise<User> {
    const user: User = await lastValueFrom(
      this.authClient.send('get_user', new GetUser(id)),
    );

    return user;
  }
}
