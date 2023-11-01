import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities';
import { mockCreateUserDto, mockSignInDto, mockUser } from '../mocks';
import { AuthRepository } from './auth.repository';
import { HashService } from './hash.service';

jest.mock('./hash.service');

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let mockHashService: jest.Mocked<HashService>;
  let mockTypeOrmRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: HashService,
          useFactory: () => ({
            compare: jest.fn(),
            hash: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(User),
          useFactory: () => ({
            create: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
          }),
        },
      ],
    }).compile();

    repository = module.get<AuthRepository>(AuthRepository);
    mockHashService = module.get(HashService);
    mockTypeOrmRepository = module.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined', () => {
    expect(mockTypeOrmRepository).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a user', async () => {
      jest
        .spyOn(mockTypeOrmRepository, 'findOneBy')
        .mockResolvedValue(mockUser);
      mockHashService.compare.mockResolvedValue(true);

      const result = await repository.signIn(mockSignInDto);

      expect(result).toEqual(mockUser);
    });

    it('should return null for user not found', async () => {
      const result = await repository.signIn(mockSignInDto);

      expect(result).toEqual(null);
    });

    it('should return null for incorrect password', async () => {
      jest
        .spyOn(mockTypeOrmRepository, 'findOneBy')
        .mockResolvedValue(mockUser);

      const result = await repository.signIn(mockSignInDto);

      expect(result).toEqual(null);
    });
  });

  describe('signUp', () => {
    it('should return a user', async () => {
      jest.spyOn(mockTypeOrmRepository, 'save').mockResolvedValue(mockUser);

      const result = await repository.signUp(mockCreateUserDto);

      expect(result).toEqual(mockUser);
    });
  });
});
