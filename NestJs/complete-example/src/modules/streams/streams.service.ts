import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { OpenAiInputMessage, Role } from '../../types';
import { User } from '../auth/entities';
import { OpenaiService } from '../openai';
import { CreateMessageDto, StreamMessageDto } from './dtos';
import { Message } from './entities';
import { StreamsRepository } from './streams.repository';

@Injectable()
export class StreamsService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly streamsRepository: StreamsRepository,
  ) {}

  findAll(user: User): Promise<Message[]> {
    return this.streamsRepository.findAll(user);
  }

  async stream(streamMessageDto: StreamMessageDto, client: Socket, user: User) {
    const userMessageDto: CreateMessageDto = {
      content: streamMessageDto.message,
      role: Role.USER,
    };

    await this.streamsRepository.create(userMessageDto, user);

    const messages = [
      {
        role: Role.SYSTEM,
        content: 'You are an expert about cats.',
      },
      userMessageDto,
    ] as OpenAiInputMessage[];

    const chatCompletion = await this.openaiService.stream(messages, 0.5);

    let answer = '';
    for await (const message of chatCompletion) {
      let content = message.choices[0].delta.content;

      if (content) {
        answer += content;
        client.emit(
          'stream',
          JSON.stringify({
            message: answer,
            error: null,
          }),
        );
      }
    }
    if (answer !== '') {
      const botMessageDto: CreateMessageDto = {
        content: answer,
        role: Role.ASSISTANT,
      };
      await this.streamsRepository.create(botMessageDto, user);
    }
    client.disconnect();
  }
}
