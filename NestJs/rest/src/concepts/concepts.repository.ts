import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateConceptDto,
  GetConceptsFilterDto,
  UpdateConceptDto,
} from './dtos';
import { Concept } from './entities/concept.entity';

@Injectable()
export class ConceptsRepository {
  constructor(
    @InjectRepository(Concept)
    private repository: Repository<Concept>,
  ) {}

  create(createConceptDto: CreateConceptDto): Promise<Concept> {
    const concept = this.repository.create(createConceptDto);

    return this.repository.save(concept);
  }

  async findAll(
    getConceptsFilterDto: GetConceptsFilterDto,
  ): Promise<Concept[]> {
    const { name, definition, comment } = getConceptsFilterDto;

    const query = this.repository.createQueryBuilder('concept');

    if (name) {
      query.andWhere('(LOWER(concept.name) LIKE LOWER(:name))', {
        name: `%${name}%`,
      });
    }

    if (definition) {
      query.andWhere('(LOWER(concept.definition) LIKE LOWER(:definition))', {
        definition: `%${definition}%`,
      });
    }

    if (comment) {
      query.andWhere('(LOWER(concept.comment) LIKE LOWER(:comment))', {
        comment: `%${comment}%`,
      });
    }

    const concepts = await query.getMany();

    return concepts;
  }

  findOne(id: string): Promise<Concept> {
    return this.repository.findOneBy({ id });
  }

  remove(concept: Concept): Promise<Concept> {
    return this.repository.remove(concept);
  }

  update(
    concept: Concept,
    updateConceptDto: UpdateConceptDto,
  ): Promise<Concept> {
    return this.repository.save({ ...concept, ...updateConceptDto });
  }
}
