import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsAndHttpExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient() as Socket;
    try {
      const response = exception.getResponse();
      client.emit(
        'error',
        JSON.stringify({
          message: null,
          error: response,
        }),
      );
    } catch {
      client.emit(
        'error',
        JSON.stringify({
          message: null,
          error: 'Error',
        }),
      );
    }
  }
}
