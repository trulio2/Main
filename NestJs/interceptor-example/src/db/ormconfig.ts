import { DataSourceOptions } from 'typeorm';
import { User } from '../users/entities';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User],
  synchronize: true,
};
