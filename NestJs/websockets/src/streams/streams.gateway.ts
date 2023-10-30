import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { StreamMessageDto } from './dtos';
import { WsAndHttpExceptionFilter } from './streams.filter';
import { StreamsService } from './streams.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UsePipes(new ValidationPipe({ whitelist: true }))
export class StreamsGateway {
  constructor(private readonly streamsService: StreamsService) {}

  @SubscribeMessage('stream')
  @UseFilters(WsAndHttpExceptionFilter)
  handleStream(
    @MessageBody() streamMessageDto: StreamMessageDto,
    @ConnectedSocket() client: Socket,
  ): void {
    this.streamsService.stream(streamMessageDto, client);
  }
}
