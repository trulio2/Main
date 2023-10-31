import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../auth/entities';

export const GetUserWs = createParamDecorator(
  (_, ctx: ExecutionContext): User => {
    return ctx.switchToWs().getClient().handshake.user;
  },
);
