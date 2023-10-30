import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Concept')
export class ConceptType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  definition: string;

  @Field()
  comment: string;
}
