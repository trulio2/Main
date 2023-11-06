import { Injectable } from '@nestjs/common';
import { CreateUserDto, FindUserDto } from './dto';
import { User } from './entities';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async findUser(findUserDto: FindUserDto): Promise<User> {
    const user = await this.authRepository.findUser(findUserDto);

    return user;
  }

  async signIn(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authRepository.signIn(createUserDto);

    return user;
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.authRepository.signUp(createUserDto);

      return user;
    } catch (error) {
      return null;
    }
  }
}
