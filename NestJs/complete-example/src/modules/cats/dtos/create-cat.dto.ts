import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString, Max, Min, MinLength } from 'class-validator';

@InputType()
export class CreateCatDto {
  @Field()
  @IsString()
  @MinLength(1)
  name: string;

  @Field()
  @IsNumber()
  @Min(0)
  @Max(100)
  age: number;
}
