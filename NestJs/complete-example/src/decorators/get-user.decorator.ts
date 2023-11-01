import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../modules/auth/entities';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
