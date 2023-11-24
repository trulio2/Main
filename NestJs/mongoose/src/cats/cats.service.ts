import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatDto, FindCatsFilterDto, UpdateCatDto } from './dto';
import { Cat } from './schemas';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);

    return createdCat.save();
  }

  async findAll(findCatsFilterDto: FindCatsFilterDto): Promise<Cat[]> {
    const { name, age, breed } = findCatsFilterDto;

    const filter = {};

    if (name) {
      filter['name'] = new RegExp(name, 'i');
    }

    if (age) {
      filter['age'] = age;
    }

    if (breed) {
      filter['breed'] = new RegExp(breed, 'i');
    }

    return this.catModel.find(filter).exec();
  }

  async findById(id: string): Promise<Cat> {
    const cat = await this.catModel.findById(id).exec();

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return cat;
  }

  async remove(id: string): Promise<Cat> {
    const cat = await this.findById(id);

    return this.catModel
      .deleteOne(cat)
      .exec()
      .then(() => cat);
  }

  async update(id: string, updateCatDto: UpdateCatDto): Promise<Cat> {
    const cat = await this.findById(id);

    Object.assign(cat, updateCatDto);

    return this.catModel
      .updateOne(cat)
      .exec()
      .then(() => cat);
  }
}
