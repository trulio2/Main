import { Expose } from 'class-transformer';

export class CatDto {
  @Expose()
  name: string;

  @Expose()
  age: number;
}
