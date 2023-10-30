import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptsModule } from './concepts/concepts.module';
import { dataSourceOptions } from './db/ormconfig';

@Module({
  imports: [ConceptsModule, TypeOrmModule.forRoot(dataSourceOptions)],
})
export class AppModule {}
