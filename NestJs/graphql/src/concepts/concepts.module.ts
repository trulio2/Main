import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptsRepository } from './concepts.repository';
import { ConceptsResolver } from './concepts.resolver';
import { ConceptsService } from './concepts.service';
import { Concept } from './entities/concept.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concept])],
  providers: [ConceptsResolver, ConceptsService, ConceptsRepository],
})
export class ConceptsModule {}
