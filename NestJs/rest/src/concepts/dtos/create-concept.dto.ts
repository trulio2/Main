import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateConceptDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  definition: string;

  @IsString()
  @IsOptional()
  comment: string;
}
