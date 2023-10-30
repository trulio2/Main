import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { StreamMessageDto } from './dtos';
import { StreamsService } from './streams.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class StreamsGateway {
  constructor(private readonly streamsService: StreamsService) {}

  @SubscribeMessage('stream')
  handleStream(
    @MessageBody() streamMessageDto: StreamMessageDto,
    @ConnectedSocket() client: Socket,
  ): void {
    this.streamsService.stream(streamMessageDto, client);
  }
}
