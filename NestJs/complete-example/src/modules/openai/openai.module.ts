import { Module } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenaiService } from './';

@Module({
  providers: [OpenaiService, OpenAI],
  exports: [OpenaiService],
})
export class OpenaiModule {}
