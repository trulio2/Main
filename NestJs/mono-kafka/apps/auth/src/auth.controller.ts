import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto, FindUserDto } from './dto';
import { User } from './entities';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('find_user')
  async findUser(findUserDto: FindUserDto): Promise<User> {
    const user = await this.authService.findUser(findUserDto);

    return user;
  }

  @MessagePattern('signIn')
  async signIn(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authService.signIn(createUserDto);

    return user;
  }

  @MessagePattern('signUp')
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authService.signUp(createUserDto);

    return user;
  }
}
