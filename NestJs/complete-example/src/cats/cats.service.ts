import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../auth/entities';
import { CatsRepository } from './cats.repository';
import { CreateCatDto, GetCatsFilterDto, UpdateCatDto } from './dtos';
import { Cat } from './entities';

@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  create(createCatDto: CreateCatDto, user: User): Promise<Cat> {
    return this.catsRepository.create(createCatDto, user);
  }

  async findAll(
    getCatsFilterDto: GetCatsFilterDto,
    user: User,
  ): Promise<Cat[]> {
    return this.catsRepository.findAll(
      getCatsFilterDto ?? ({} as GetCatsFilterDto),
      user,
    );
  }

  async findOne(id: string, user: User): Promise<Cat> {
    const cat = await this.catsRepository.findOne(id, user);

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return cat;
  }

  async remove(id: string, user: User): Promise<Cat> {
    const cat = await this.findOne(id, user);

    return this.catsRepository.remove(cat);
  }

  async update(
    id: string,
    updateCatDto: UpdateCatDto,
    user: User,
  ): Promise<Cat> {
    const cat = await this.findOne(id, user);

    return this.catsRepository.update(cat, updateCatDto);
  }
}
