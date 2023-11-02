import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.schema';
import { dataSourceOptions } from './db/data-source';
import {
  AuthModule,
  CatsModule,
  OpenaiModule,
  StreamsModule,
  UsersModule,
} from './modules';

@Module({
  imports: [
    AuthModule,
    CatsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidationSchema,
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      formatError: (error) => {
        return {
          message: error.message,
          locations: error.locations,
          path: error.path,
          extensions: {
            code: error.extensions.code,
          },
        };
      },
    }),
    OpenaiModule,
    StreamsModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
  ],
})
export class AppModule {}
