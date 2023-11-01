import { IsEnum, IsString } from 'class-validator';
import { Role } from '../../../types';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsEnum(Role)
  role: Role;
}
