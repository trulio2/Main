import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptsController } from './concepts.controller';
import { ConceptsRepository } from './concepts.repository';
import { ConceptsService } from './concepts.service';
import { Concept } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Concept])],
  controllers: [ConceptsController],
  providers: [ConceptsService, ConceptsRepository],
})
export class ConceptsModule {}
