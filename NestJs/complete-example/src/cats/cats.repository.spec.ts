import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from '../auth/entities';
import { CreateCatDto, GetCatsFilterDto } from './dtos';
import { Cat } from './entities';
import { CatsRepository } from './cats.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CatsRepository', () => {
  let repository: CatsRepository;
  let mockTypeOrmRepository: Repository<Cat>;
  let mockUser = { username: 'Mock User' } as User;
  let mockCat = { name: 'Mock Cat', age: 1 } as Cat;

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

      const result = await repository.create({} as CreateCatDto, mockUser);

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

      const result = await repository.findAll(
        mockCat as GetCatsFilterDto,
        mockUser,
      );

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

      const result = await repository.update(mockCat, {} as CreateCatDto);

      expect(result).toEqual(mockCat);
    });
  });
});
