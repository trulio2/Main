import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../decorators';
import { AuthGuard } from '../../guards';
import { User } from '../auth/types';
import { CatsService } from './cats.service';

@Controller('cats')
@UseGuards(AuthGuard)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}
  private logger = new Logger('CatsController');

  @Get()
  findAll(@CurrentUser() user: User): string {
    this.logger.verbose(`user: ${JSON.stringify(user)}`);

    return this.catsService.findAll();
  }
}
