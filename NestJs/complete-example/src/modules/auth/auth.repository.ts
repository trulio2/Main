import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, SignInDto } from './dtos';
import { User } from './entities';
import { HashService } from './hash';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private baseRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<User> {
    const { username, password } = signInDto;
    const user = await this.baseRepository.findOneBy({ username });

    if (user && (await this.hashService.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { username, role, password, email, firstName, lastName } =
      createUserDto;

    const hashedPassword = await this.hashService.hash(password);

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
