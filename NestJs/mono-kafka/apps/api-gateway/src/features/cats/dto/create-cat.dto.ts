import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCatDto {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  @MinLength(4)
  @MaxLength(30)
  breed: string;
}
