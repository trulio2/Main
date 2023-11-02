import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('RemoveCat')
export class RemoveCatType {
  @Field()
  name: string;

  @Field()
  age: number;
}
