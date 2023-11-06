import { Injectable } from '@nestjs/common';
import { Cat } from './entities';
import { CatsRepository } from './cats.repository';
import { CreateCatDto, User } from './dto';

@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  async findAll(user: User): Promise<Cat[]> {
    return await this.catsRepository.findAll(user);
  }

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    return await this.catsRepository.create(createCatDto);
  }
}
