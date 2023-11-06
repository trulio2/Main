import { Injectable } from '@nestjs/common';
import { GetCatDto } from './dto';
import { Cat } from './entities';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [
    {
      id: '1',
      name: 'Cat 1',
      userId: '1',
    },
    {
      id: '3',
      name: 'Cat 3',
      userId: '1',
    },
    {
      id: '2',
      name: 'Cat 2',
      userId: '2',
    },
  ];
  handleOrderCreated(getCatDto: GetCatDto) {
    const cat = this.cats.filter((c) => c.userId === getCatDto.id);

    return cat;
  }
}
