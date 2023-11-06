import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './entities';
import { CreateCatDto, User } from './dto';

@Injectable()
export class CatsRepository {
  constructor(
    @InjectRepository(Cat)
    private repository: Repository<Cat>,
  ) {}

  async findAll(user: User): Promise<Cat[]> {
    const { userId } = user;

    const cats = await this.repository.findBy({ userId });

    return cats;
  }

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const { name, age, breed, userId } = createCatDto;

    const cat = this.repository.create({ name, age, breed, userId: userId });

    await this.repository.save(cat);

    return cat;
  }
}
