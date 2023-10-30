import { DataSourceOptions } from 'typeorm';
import { Concept } from '../concepts/entities/concept.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [Concept],
  synchronize: true,
};
