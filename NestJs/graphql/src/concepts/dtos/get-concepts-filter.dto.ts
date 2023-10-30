import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class GetConceptsFilterDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  definition: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  comment: string;
}
