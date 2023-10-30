import { Module } from '@nestjs/common';
import { OpenaiModule } from '../openai/openai.module';
import { StreamsGateway } from './streams.gateway';
import { StreamsService } from './streams.service';

@Module({
  imports: [OpenaiModule],
  providers: [StreamsGateway, StreamsService],
})
export class StreamsModule {}
