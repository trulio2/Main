import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CatType } from './cat.type';
import { UserRole } from '.';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  role: UserRole;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => [CatType])
  cats: CatType[];
}
