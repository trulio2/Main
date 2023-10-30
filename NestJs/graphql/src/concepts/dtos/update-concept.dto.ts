import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class UpdateConceptDto {
  @Field({ nullable: true })
  @MinLength(1)
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
