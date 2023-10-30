import { Injectable, NotFoundException } from '@nestjs/common';
import { ConceptsRepository } from './concepts.repository';
import {
  CreateConceptDto,
  GetConceptsFilterDto,
  UpdateConceptDto,
} from './dtos';
import { Concept } from './entities/concept.entity';

@Injectable()
export class ConceptsService {
  constructor(private readonly conceptsRepository: ConceptsRepository) {}

  createConcept(createConceptDto: CreateConceptDto): Promise<Concept> {
    return this.conceptsRepository.create(createConceptDto);
  }

  async getConcepts(
    getConceptsFilterDto: GetConceptsFilterDto,
  ): Promise<Concept[]> {
    return this.conceptsRepository.find(
      getConceptsFilterDto ?? ({} as GetConceptsFilterDto),
    );
  }

  async getConcept(id: string): Promise<Concept> {
    const concept = await this.conceptsRepository.findOne(id);

    if (!concept) {
      throw new NotFoundException('Concept not found');
    }

    return concept;
  }

  async removeConcept(id: string): Promise<Concept> {
    const concept = await this.getConcept(id);

    await this.conceptsRepository.remove(concept);

    return { ...concept, id: id };
  }

  async updateConcept(
    id: string,
    updateConceptDto: UpdateConceptDto,
  ): Promise<Concept> {
    const concept = await this.getConcept(id);

    return this.conceptsRepository.update(concept, updateConceptDto);
  }
}
