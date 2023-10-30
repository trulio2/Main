import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsAndHttpExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const response = exception.getResponse();
    const ctx = host.switchToWs();
    const client = ctx.getClient() as Socket;

    client.emit(
      'stream',
      JSON.stringify({
        message: null,
        error: response,
      }),
    );
  }
}
