import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateUserDto, mockSignInDto, mockUser } from '../../mocks';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

jest.mock('./auth.repository');

describe('AuthService', () => {
  let service: AuthService;
  let mockRepository: jest.Mocked<AuthRepository>;
  let mockJwtService: jest.Mocked<JwtService>;

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
    mockRepository = module.get(AuthRepository);
    mockJwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(mockJwtService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a user', async () => {
      mockRepository.signIn.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.signIn(mockSignInDto);

      expect(result).toEqual({ accessToken: 'token' });
    });

    it('should throw an error', async () => {
      mockRepository.signIn.mockResolvedValue(null);

      expect(service.signIn(mockSignInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signUp', () => {
    it('should return a user', async () => {
      mockRepository.signUp.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.signUp(mockCreateUserDto);

      expect(result).toEqual({ accessToken: 'token' });
    });

    it('should throw an error', async () => {
      mockRepository.signUp.mockRejectedValue({ code: '23505' });

      expect(service.signUp(mockCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw an error', async () => {
      mockRepository.signUp.mockRejectedValue({ code: '12345' });

      expect(service.signUp(mockCreateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
