import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ConceptsService } from './concepts.service';
import { ConceptType } from './concept.type';
import {
  CreateConceptDto,
  GetConceptsFilterDto,
  UpdateConceptDto,
} from './dtos';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => ConceptType)
export class ConceptsResolver {
  constructor(private readonly conceptsService: ConceptsService) {}

  @Query(() => [ConceptType])
  concepts(
    @Args('getConceptsFilterDto', { nullable: true })
    getConceptsFilterDto: GetConceptsFilterDto,
  ) {
    return this.conceptsService.getConcepts(getConceptsFilterDto);
  }

  @Query(() => ConceptType)
  concept(@Args('id', ParseUUIDPipe) id: string) {
    return this.conceptsService.getConcept(id);
  }

  @Mutation(() => ConceptType)
  createConcept(@Args('createConceptDto') createConceptDto: CreateConceptDto) {
    return this.conceptsService.createConcept(createConceptDto);
  }

  @Mutation(() => ConceptType)
  removeConcept(@Args('id', ParseUUIDPipe) id: string) {
    return this.conceptsService.removeConcept(id);
  }

  @Mutation(() => ConceptType)
  updateConcept(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateConceptDto') updateConceptDto: UpdateConceptDto,
  ) {
    return this.conceptsService.updateConcept(id, updateConceptDto);
  }
}
