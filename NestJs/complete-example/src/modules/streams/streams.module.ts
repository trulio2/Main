import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenaiModule } from '../openai';
import { Message } from './entities';
import { StreamsGateway } from './streams.gateway';
import { StreamsRepository } from './streams.repository';
import { StreamsService } from './streams.service';

@Module({
  imports: [OpenaiModule, TypeOrmModule.forFeature([Message])],
  providers: [StreamsGateway, StreamsRepository, StreamsService],
})
export class StreamsModule {}
