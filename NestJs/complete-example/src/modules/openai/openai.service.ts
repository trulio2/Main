import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { APIPromise } from 'openai/core';
import { Stream } from 'openai/streaming';
import { OpenAiInputMessage } from '../../types';

@Injectable()
export class OpenaiService {
  constructor(private readonly openai: OpenAI) {}

  async chat(
    messages: OpenAiInputMessage[],
    temperature: number,
  ): Promise<string> {
    const answer = await this.openai.chat.completions.create({
      messages: messages,
      model: 'gpt-3.5-turbo',
      temperature: temperature,
    });

    const message = answer.choices[0].message.content;

    return message;
  }

  stream(
    messages: OpenAiInputMessage[],
    temperature: number,
  ): APIPromise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    return this.openai.chat.completions.create({
      messages: messages,
      model: 'gpt-3.5-turbo',
      temperature: temperature,
      stream: true,
    });
  }
}
