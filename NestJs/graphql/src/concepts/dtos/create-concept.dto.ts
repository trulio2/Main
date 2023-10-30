import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateConceptDto {
  @Field()
  @IsString()
  @MinLength(1)
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
