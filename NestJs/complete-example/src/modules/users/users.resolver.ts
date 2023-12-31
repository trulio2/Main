import { Logger, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GetUserGraphQl, Role } from '../../decorators';
import { GraphqlGuard, RoleGuard } from '../../guards';
import { UserType } from '../../types';
import { User } from '../auth/entities';
import { UsersService } from './users.service';

@Resolver()
@UseGuards(GraphqlGuard)
@Role('admin')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  private logger = new Logger('UsersResolver');

  @Query(() => [UserType])
  @UseGuards(RoleGuard)
  findAllUsers(@GetUserGraphQl() user: User): Promise<UserType[]> {
    this.logger.verbose(`${user.username} - Get All Users`);

    return this.usersService.findAll();
  }
}
