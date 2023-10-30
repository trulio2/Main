import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Logger,
} from '@nestjs/common';
import { ConceptsService } from './concepts.service';
import {
  CreateConceptDto,
  GetConceptsFilterDto,
  UpdateConceptDto,
} from './dtos';
import { Concept } from './entities';

@Controller('concepts')
export class ConceptsController {
  private readonly logger = new Logger('ConceptsController');

  constructor(private readonly conceptsService: ConceptsService) {}

  @Post()
  async create(@Body() createConceptDto: CreateConceptDto): Promise<Concept> {
    const concept = await this.conceptsService.create(createConceptDto);

    this.logger.verbose(`Concept created: ${JSON.stringify(concept)}`);

    return concept;
  }

  @Get()
  async findAll(
    @Query() getConceptsFilterDto: GetConceptsFilterDto,
  ): Promise<Concept[]> {
    const concepts = await this.conceptsService.findAll(getConceptsFilterDto);

    this.logger.verbose(`Concepts found: ${JSON.stringify(concepts)}`);

    return concepts;
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Concept> {
    const concept = await this.conceptsService.findOne(id);

    this.logger.verbose(`Concept found: ${JSON.stringify(concept)}`);

    return concept;
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<Concept> {
    const concept = await this.conceptsService.remove(id);

    this.logger.verbose(`Concept removed: ${JSON.stringify(concept)}`);

    return concept;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConceptDto: UpdateConceptDto,
  ): Promise<Concept> {
    const concept = await this.conceptsService.update(id, updateConceptDto);

    this.logger.verbose(`Concept updated: ${JSON.stringify(concept)}`);

    return concept;
  }
}
