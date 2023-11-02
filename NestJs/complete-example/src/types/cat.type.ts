import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Cat')
export class CatType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  age: number;
}
