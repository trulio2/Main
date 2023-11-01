import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { User } from './entities';
import { CreateUserDto, SignInDto } from './dtos';

jest.mock('./auth.repository');

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let mockUser = { username: 'Mock User' } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useFactory: () => ({
            sign: jest.fn(),
          }),
        },
        {
          provide: AuthRepository,
          useFactory: () => ({
            signIn: jest.fn(),
            signUp: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
    authRepository = module.get(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a user', async () => {
      authRepository.signIn.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('token');

      const result = await service.signIn({} as SignInDto);

      expect(result).toEqual({ accessToken: 'token' });
    });

    it('should throw an error', async () => {
      authRepository.signIn.mockResolvedValue(null);

      expect(service.signIn({} as SignInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signUp', () => {
    it('should return a user', async () => {
      authRepository.signUp.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('token');

      const result = await service.signUp({} as CreateUserDto);

      expect(result).toEqual({ accessToken: 'token' });
    });

    it('should throw an error', async () => {
      authRepository.signUp.mockRejectedValue({ code: '23505' });

      expect(service.signUp({} as CreateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw an error', async () => {
      authRepository.signUp.mockRejectedValue({ code: '12345' });

      expect(service.signUp({} as CreateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
