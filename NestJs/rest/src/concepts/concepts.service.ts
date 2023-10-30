import { Injectable, NotFoundException } from '@nestjs/common';
import { ConceptsRepository } from './concepts.repository';
import {
  CreateConceptDto,
  GetConceptsFilterDto,
  UpdateConceptDto,
} from './dtos';
import { Concept } from './entities';

@Injectable()
export class ConceptsService {
  constructor(private readonly conceptsRepository: ConceptsRepository) {}

  create(createConceptDto: CreateConceptDto): Promise<Concept> {
    return this.conceptsRepository.create(createConceptDto);
  }

  findAll(getConceptsFilterDto: GetConceptsFilterDto): Promise<Concept[]> {
    return this.conceptsRepository.findAll(
      getConceptsFilterDto ?? ({} as GetConceptsFilterDto),
    );
  }

  async findOne(id: string): Promise<Concept> {
    const concept = await this.conceptsRepository.findOne(id);

    if (!concept) {
      throw new NotFoundException(`Concept with ID "${id}" not found`);
    }

    return concept;
  }

  async remove(id: string): Promise<Concept> {
    const concept = await this.findOne(id);

    return this.conceptsRepository.remove(concept);
  }

  async update(
    id: string,
    updateConceptDto: UpdateConceptDto,
  ): Promise<Concept> {
    const concept = await this.findOne(id);

    return this.conceptsRepository.update(concept, updateConceptDto);
  }
}
