import { IsString } from 'class-validator';

export class StreamMessageDto {
  @IsString()
  message: string;

  @IsString()
  otherField: string;
}
