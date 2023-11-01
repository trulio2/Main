import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  mockCat,
  mockCreateCatDto,
  mockGetCatsFilterDto,
  mockUser,
} from '../../mocks';
import { CatsRepository } from './cats.repository';
import { Cat } from './entities';

describe('CatsRepository', () => {
  let repository: CatsRepository;
  let mockTypeOrmRepository: Repository<Cat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsRepository,
        {
          provide: getRepositoryToken(Cat),
          useFactory: () => ({
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          }),
        },
      ],
    }).compile();

    repository = module.get<CatsRepository>(CatsRepository);
    mockTypeOrmRepository = module.get<Repository<Cat>>(
      getRepositoryToken(Cat),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined', () => {
    expect(mockTypeOrmRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a cat', async () => {
      jest.spyOn(mockTypeOrmRepository, 'create').mockReturnValue(mockCat);
      jest.spyOn(mockTypeOrmRepository, 'save').mockResolvedValue(mockCat);

      const result = await repository.create(mockCreateCatDto, mockUser);

      expect(result).toEqual(mockCat);
    });
  });

  describe('findAll', () => {
    it('should find all cats', async () => {
      jest.spyOn(mockTypeOrmRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn(),
        andWhere: jest.fn(),
        getMany: jest.fn().mockResolvedValue([mockCat, mockCat]),
      } as any);

      const result = await repository.findAll(mockGetCatsFilterDto, mockUser);

      expect(result).toEqual([mockCat, mockCat]);
    });
  });

  describe('findOne', () => {
    it('should find one cat by id', async () => {
      jest.spyOn(mockTypeOrmRepository, 'findOneBy').mockResolvedValue(mockCat);

      const result = await repository.findOne('uuid', mockUser);

      expect(result).toEqual(mockCat);
    });
  });

  describe('remove', () => {
    it('should remove a cat', async () => {
      jest.spyOn(mockTypeOrmRepository, 'remove').mockResolvedValue(mockCat);

      const result = await repository.remove(mockCat);

      expect(result).toEqual(mockCat);
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      jest.spyOn(mockTypeOrmRepository, 'save').mockResolvedValue(mockCat);

      const result = await repository.update(mockCat, mockCreateCatDto);

      expect(result).toEqual(mockCat);
    });
  });
});
