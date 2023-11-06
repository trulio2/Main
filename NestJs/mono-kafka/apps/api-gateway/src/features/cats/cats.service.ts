import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  CatDto,
  CreateCatDto,
  CreateCatEmit,
  CurrentUserDto,
  FindCatEmit,
} from './dto';

@Injectable()
export class CatsService {
  constructor(
    @Inject('CATS_SERVICE') private readonly catsClient: ClientKafka,
  ) {}

  async findAll(user: CurrentUserDto): Promise<CatDto[]> {
    const cats = await lastValueFrom(
      this.catsClient.send('get_cats', new FindCatEmit(user.id)),
    );

    return cats;
  }

  async create(
    createCatDto: CreateCatDto,
    user: CurrentUserDto,
  ): Promise<CatDto> {
    const { name, age, breed } = createCatDto;

    const cat = await lastValueFrom(
      this.catsClient.send(
        'create_cat',
        new CreateCatEmit(name, age, breed, user.id),
      ),
    );

    return cat;
  }
}
