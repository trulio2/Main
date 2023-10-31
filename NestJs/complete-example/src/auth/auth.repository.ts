import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto, SignInDto } from './dtos';
import { User } from './entities';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private baseRepository: Repository<User>,
  ) {}

  async signIn(signInDto: SignInDto): Promise<User> {
    const { username, password } = signInDto;
    const user = await this.baseRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { username, role, password, email, firstName, lastName } =
      createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.baseRepository.create({
      username,
      role,
      password: hashedPassword,
      email,
      firstName,
      lastName,
    });

    return await this.baseRepository.save(user);
  }
}
