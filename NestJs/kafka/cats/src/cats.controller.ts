import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CatsService } from './cats.service';
import { GetCatDto } from './dto';

@Controller()
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @MessagePattern('get_cat')
  handleOrderCreated(getCatDto: GetCatDto) {
    console.log('cats', getCatDto);
    const cat = this.catsService.handleOrderCreated(getCatDto);

    console.log(cat);

    return cat;
  }
}
