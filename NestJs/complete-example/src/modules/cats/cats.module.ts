import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsRepository } from './cats.repository';
import { CatsResolver } from './cats.resolver';
import { CatsService } from './cats.service';
import { Cat } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  providers: [CatsRepository, CatsResolver, CatsService],
})
export class CatsModule {}
