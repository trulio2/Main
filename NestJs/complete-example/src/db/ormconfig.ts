import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { User } from '../modules/auth/entities';
import { Cat } from '../modules/cats/entities';
import { Message } from '../modules/streams/entities';

const isProduction = process.env.NODE_ENV === 'prod';

export const dataSourceOptions: DataSourceOptions = {
  ssl: isProduction,
  extra: {
    ssl: isProduction ? { rejectUnauthorized: false } : null,
  },
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Cat, Message, User],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
