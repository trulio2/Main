import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

@InputType()
export class GetCatsFilterDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name: string;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  age: number;
}
