import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockUser } from '../mocks';
import { User } from '../auth/entities';
import { UsersRepository } from './users.repository';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let mockTypeOrmRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(User),
          useFactory: () => ({
            createQueryBuilder: jest.fn(),
          }),
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
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

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(mockTypeOrmRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn(),
        getMany: jest.fn().mockResolvedValue([mockUser, mockUser]),
      } as any);

      const result = await repository.findAll();

      expect(result).toEqual([mockUser, mockUser]);
    });
  });
});
