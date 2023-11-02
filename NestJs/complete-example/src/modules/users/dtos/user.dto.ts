import { Expose, Type } from 'class-transformer';
import { CatDto } from './';

export class UserDto {
  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => CatDto)
  cats: CatDto[];
}
