import { Field, InputType } from '@nestjs/graphql';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class UpdateCatDto {
  @Field({ nullable: true })
  @IsString()
  @MinLength(1)
  @IsOptional()
  name: string;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  age: number;
}
