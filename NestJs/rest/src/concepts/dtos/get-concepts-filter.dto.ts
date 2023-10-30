import { IsString, IsOptional } from 'class-validator';

export class GetConceptsFilterDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  definition: string;

  @IsString()
  @IsOptional()
  comment: string;
}
