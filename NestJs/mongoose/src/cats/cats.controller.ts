import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../pipes';
import { CatsService } from './cats.service';
import { CreateCatDto, UpdateCatDto } from './dto';
import { Cat } from './schemas';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseObjectIdPipe) id: string): Promise<Cat> {
    return this.catsService.findById(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string): Promise<Cat> {
    return this.catsService.remove(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<Cat> {
    return this.catsService.update(id, updateCatDto);
  }
}
