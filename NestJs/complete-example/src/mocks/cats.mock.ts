import { CreateCatDto, GetCatsFilterDto, UpdateCatDto } from '../cats/dtos';
import { Cat } from '../cats/entities';

export const mockCat = { name: 'Mock Cat' } as Cat;
export const mockCreateCatDto = { name: 'Mock Cat' } as CreateCatDto;
export const mockGetCatsFilterDto = {
  name: 'Mock Cat',
  age: 0,
} as GetCatsFilterDto;
export const mockUpdateCatDto = {} as UpdateCatDto;
