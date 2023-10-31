import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('RemoveCatType')
export class RemoveCatType {
  @Field()
  name: string;

  @Field()
  age: number;
}
