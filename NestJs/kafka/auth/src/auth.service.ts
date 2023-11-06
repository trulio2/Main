import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CatRequest, GetUserDto } from './dto';
import { User } from './entities';

@Injectable()
export class AuthService {
  constructor(
    @Inject('CATS_SERVICE') private readonly catsClient: ClientKafka,
  ) {}
  private readonly users: User[] = [
    {
      id: '1',
      name: 'User 1',
    },
    {
      id: '2',
      name: 'User 2',
    },
  ];

  async getUser(getUserDto: GetUserDto): Promise<User> {
    const user = this.users.find((u) => u.id === getUserDto.id);

    if (!user) {
      return null;
    }

    const cat = await lastValueFrom(
      this.catsClient.send('get_cat', new CatRequest(getUserDto.id)),
    );

    user.cats = cat;

    return user;
  }
}
