import { Logger, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../auth/entities';
import { GetUserGraphQl } from '../decorators';
import { GraphqlGuard } from '../guards';
import { CatsService } from './cats.service';
import { CreateCatDto, GetCatsFilterDto, UpdateCatDto } from './dtos';
import { CatType, RemoveCatType } from './types';

@Resolver()
@UseGuards(GraphqlGuard)
export class CatsResolver {
  constructor(private readonly catsService: CatsService) {}
  private logger = new Logger('CatsResolver');

  @Mutation(() => CatType)
  create(
    @Args('createCatDto') createCatDto: CreateCatDto,
    @GetUserGraphQl() user: User,
  ) {
    this.logger.verbose(
      `${user.username} - Add Cat - ${JSON.stringify(createCatDto)}`,
    );
    return this.catsService.create(createCatDto, user);
  }

  @Query(() => [CatType])
  findAll(
    @Args('getCatsFilterDto', { nullable: true })
    getCatsFilterDto: GetCatsFilterDto,
    @GetUserGraphQl() user: User,
  ) {
    this.logger.verbose(
      `${user.username} - Get All Cats - ${
        getCatsFilterDto ? JSON.stringify(getCatsFilterDto) : ''
      }`,
    );
    return this.catsService.findAll(getCatsFilterDto, user);
  }

  @Query(() => CatType)
  findOne(@Args('id', ParseUUIDPipe) id: string, @GetUserGraphQl() user: User) {
    this.logger.verbose(`${user.username} - Get Cat - ${id}`);
    return this.catsService.findOne(id, user);
  }

  @Mutation(() => RemoveCatType)
  remove(@Args('id', ParseUUIDPipe) id: string, @GetUserGraphQl() user: User) {
    this.logger.verbose(`${user.username} - Remove Cat - ${id}`);
    return this.catsService.remove(id, user);
  }

  @Mutation(() => CatType)
  update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateCatDto') updateCatDto: UpdateCatDto,
    @GetUserGraphQl() user: User,
  ) {
    this.logger.verbose(
      `${user.username} - Update Cat - ${id} - ${JSON.stringify(updateCatDto)}`,
    );
    return this.catsService.update(id, updateCatDto, user);
  }
}
