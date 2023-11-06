import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { JwtPayload } from '../../strategies';
import { CreateUserDto, CreateUserEmit } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    private jwtService: JwtService,
  ) {}

  async signIn(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const { username, password } = createUserDto;
    const user = await lastValueFrom(
      this.authClient.send('signIn', new CreateUserEmit(username, password)),
    );

    if (!user || !user.username) {
      throw new UnauthorizedException('Username or Password Incorrect');
    }

    const payload: JwtPayload = { username: user.username };
    const accessToken: string = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const { username, password } = createUserDto;

    const user = await lastValueFrom(
      this.authClient.send('signUp', new CreateUserEmit(username, password)),
    );

    if (!user || !user.username) {
      throw new UnauthorizedException('Username Not Available');
    }

    const payload: JwtPayload = { username: user.username };
    const accessToken: string = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }
}
