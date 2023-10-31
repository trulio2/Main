import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../auth/entities';

export const GetUserGraphQl = createParamDecorator(
  (_, ctx: ExecutionContext): User => {
    const ctxGql = GqlExecutionContext.create(ctx);
    const req = ctxGql.getContext().req;
    return req.user;
  },
);
