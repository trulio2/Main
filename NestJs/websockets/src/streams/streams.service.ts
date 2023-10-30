import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { OpenaiService } from '../openai/openai.service';
import { Message, Role } from '../types';
import { StreamMessageDto } from './dtos';

@Injectable()
export class StreamsService {
  constructor(private readonly openai: OpenaiService) {}

  async stream(streamMessageDto: StreamMessageDto, client: Socket) {
    const messages: Message[] = [
      {
        role: Role.USER,
        content: streamMessageDto.message,
      },
    ];

    const chatCompletion = await this.openai.stream(messages, 0.5);

    let answer = '';
    for await (const message of chatCompletion) {
      let content = message.choices[0].delta.content;

      if (content) {
        answer += content;
        client.emit('stream', answer);
      }
    }
    client.disconnect();
  }
}
