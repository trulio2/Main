import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './types';

@Injectable()
export class AuthService {
  private users: User[] = [];

  async findOne(userId: number) {
    return this.users.find((user) => user.userId === userId);
  }

  signin(name: string): User {
    const user = this.users.find((user) => user.userName === name);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async signup(name: string) {
    const user = {
      userId: this.users.length + 1,
      userName: name,
    };
    this.users.push(user);

    return user;
  }
}
