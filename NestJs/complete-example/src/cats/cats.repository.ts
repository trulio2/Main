import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities';
import { CreateCatDto, GetCatsFilterDto, UpdateCatDto } from './dtos';
import { Cat } from './entities';

@Injectable()
export class CatsRepository {
  constructor(
    @InjectRepository(Cat)
    private repository: Repository<Cat>,
  ) {}

  create(createCatDto: CreateCatDto, user: User): Promise<Cat> {
    const cat = this.repository.create({
      ...createCatDto,
      user,
    });

    return this.repository.save(cat);
  }

  async findAll(
    getCatsFilterDto: GetCatsFilterDto,
    user: User,
  ): Promise<Cat[]> {
    const { name, age } = getCatsFilterDto;

    const query = this.repository.createQueryBuilder('cat');

    query.where({ user });

    if (name) {
      query.andWhere('(LOWER(cat.name) LIKE LOWER(:name))', {
        name: `%${name}%`,
      });
    }

    if (!isNaN(Number(age))) {
      query.andWhere('cat.age = :age', { age: Number(age) });
    }

    const cats = await query.getMany();

    return cats;
  }

  findOne(id: string, user: User): Promise<Cat> {
    return this.repository.findOneBy({ id, user });
  }

  remove(cat: Cat): Promise<Cat> {
    return this.repository.remove(cat);
  }

  update(cat: Cat, updateCatDto: UpdateCatDto): Promise<Cat> {
    return this.repository.save({ ...cat, ...updateCatDto });
  }
}
