import { DataSource, DataSourceOptions } from 'typeorm';
import { Concept } from '../concepts/entities/concept.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [Concept],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
