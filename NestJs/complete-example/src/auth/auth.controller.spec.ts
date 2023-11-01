import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInDto } from './dtos';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('./auth.service');

describe('CatsResolver', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let token = { accessToken: 'token' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
          useFactory: () => ({
            signIn: jest.fn(),
            signUp: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return the access token', async () => {
      authService.signIn.mockResolvedValue(token);

      const result = await controller.signIn({} as SignInDto);

      expect(result).toEqual(token);
    });

    it('should throw an UnauthorizedException', async () => {
      authService.signIn.mockRejectedValue(new UnauthorizedException());

      await expect(controller.signIn({} as SignInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signUp', () => {
    it('should return the access token', async () => {
      authService.signUp.mockResolvedValue(token);

      const result = await controller.signUp({} as CreateUserDto);

      expect(result).toEqual(token);
    });

    it('should throw an error', async () => {
      authService.signUp.mockRejectedValue(new Error());

      await expect(controller.signUp({} as CreateUserDto)).rejects.toThrow(
        Error,
      );
    });
  });
});
