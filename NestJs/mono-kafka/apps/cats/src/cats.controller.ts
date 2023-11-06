import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CatsService } from './cats.service';
import { Cat } from './entities';
import { CreateCatDto, User } from './dto';

@Controller()
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @MessagePattern('get_cats')
  async findAll(user: User): Promise<Cat[]> {
    const cats = await this.catsService.findAll(user);

    return cats;
  }

  @MessagePattern('create_cat')
  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const cat = await this.catsService.create(createCatDto);

    return cat;
  }
}
