import { IsOptional, IsString, MinLength } from 'class-validator';

export class StreamMessageDto {
  @IsString()
  @MinLength(2)
  message: string;

  @IsString()
  @IsOptional()
  otherField: string;
}
