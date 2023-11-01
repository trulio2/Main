import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { CreateUserDto, SignInDto } from './dtos';
import { JwtPayload } from './strategies/jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private usersRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const signedInUser = await this.usersRepository.signIn(signInDto);

    if (signedInUser) {
      const payload: JwtPayload = { username: signedInUser.username };
      const accessToken: string = this.jwtService.sign(payload);
      this.logger.verbose(`User ${signedInUser.username} signed in`);

      return {
        accessToken,
      };
    }

    throw new UnauthorizedException('Username or Password Incorrect');
  }

  async signUp(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    try {
      const newUser = await this.usersRepository.signUp(createUserDto);

      const payload: JwtPayload = { username: newUser.username };
      const accessToken: string = this.jwtService.sign(payload);
      this.logger.verbose(`User ${newUser.username} signed up`);

      return {
        accessToken,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username Not Available');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
