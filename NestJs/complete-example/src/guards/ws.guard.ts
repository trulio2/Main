import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WsGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToWs().getClient().handshake;
    req.headers.authorization = `Bearer ${req.query.token}`;
    return req;
  }
}
