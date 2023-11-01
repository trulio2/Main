import { User } from '../modules/auth/entities';
import { CreateUserDto, SignInDto } from '../modules/auth/dtos';

export const mockUser = { username: 'Mock User' } as User;
export const mockToken = { accessToken: 'token' };
export const mockCreateUserDto = {} as CreateUserDto;
export const mockSignInDto = {} as SignInDto;
