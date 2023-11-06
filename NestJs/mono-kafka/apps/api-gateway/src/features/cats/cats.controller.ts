import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../decorators';
import { CatsService } from './cats.service';
import { CatDto, CreateCatDto, CurrentUserDto } from './dto';

@Controller('cats')
@UseGuards(AuthGuard())
export class CatsController implements OnModuleInit {
  constructor(
    private readonly catsService: CatsService,
    @Inject('CATS_SERVICE') private readonly catsClient: ClientKafka,
  ) {}

  @Get()
  async findAll(@GetUser() user: CurrentUserDto): Promise<CatDto[]> {
    const cats = await this.catsService.findAll(user);

    return cats;
  }

  @Post()
  async create(
    @Body() createCatDto: CreateCatDto,
    @GetUser() user: CurrentUserDto,
  ): Promise<CatDto> {
    const cat = await this.catsService.create(createCatDto, user);

    return cat;
  }

  onModuleInit() {
    this.catsClient.subscribeToResponseOf('create_cat');
    this.catsClient.subscribeToResponseOf('get_cats');
  }
}
