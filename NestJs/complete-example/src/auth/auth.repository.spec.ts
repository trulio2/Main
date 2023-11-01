import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities';
import { AuthRepository } from './auth.repository';
import { CreateUserDto, SignInDto } from './dtos';
import { HashService } from './hash.service';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let hashService: jest.Mocked<HashService>;
  let mockTypeOrmRepository: Repository<User>;
  let mockUser = { username: 'Mock User' } as User;

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
    hashService = module.get(HashService);
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
      hashService.compare.mockResolvedValue(true);

      const result = await repository.signIn({} as SignInDto);

      expect(result).toEqual(mockUser);
    });

    it('should return null for user not found', async () => {
      jest.spyOn(mockTypeOrmRepository, 'findOneBy').mockResolvedValue(null);

      const result = await repository.signIn({} as SignInDto);

      expect(result).toEqual(null);
    });

    it('should return null for incorrect password', async () => {
      jest
        .spyOn(mockTypeOrmRepository, 'findOneBy')
        .mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(false);

      const result = await repository.signIn({} as SignInDto);

      expect(result).toEqual(null);
    });
  });

  describe('signUp', () => {
    it('should return a user', async () => {
      jest.spyOn(mockTypeOrmRepository, 'save').mockResolvedValue(mockUser);

      const result = await repository.signUp({} as CreateUserDto);

      expect(result).toEqual(mockUser);
    });
  });
});
