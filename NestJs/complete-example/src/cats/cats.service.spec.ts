import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { CatsRepository } from './cats.repository';
import { NotFoundException } from '@nestjs/common';
import { User } from '../auth/entities';
import { Cat } from './entities';
import { CreateCatDto, GetCatsFilterDto, UpdateCatDto } from './dtos';

describe('CatsService', () => {
  let service: CatsService;
  let catsRepository: jest.Mocked<CatsRepository>;
  let mockUser: User;
  let mockCat: Cat;

  beforeEach(async () => {
    mockUser = new User();
    mockCat = new Cat();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: CatsRepository,
          useFactory: () => ({
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    catsRepository = module.get(CatsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cat', async () => {
      catsRepository.create.mockResolvedValue(mockCat);
      expect(await service.create({} as CreateCatDto, mockUser)).toEqual(
        mockCat,
      );
    });
  });

  describe('findAll', () => {
    it('should find all cats', async () => {
      catsRepository.findAll.mockResolvedValue([mockCat]);
      expect(await service.findAll({} as GetCatsFilterDto, mockUser)).toEqual([
        mockCat,
      ]);
    });
  });

  describe('findOne', () => {
    it('should find one cat by id', async () => {
      catsRepository.findOne.mockResolvedValue(mockCat);
      expect(await service.findOne('1', mockUser)).toEqual(mockCat);
    });

    it('should throw an error if cat is not found', async () => {
      catsRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('1', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a cat by id', async () => {
      catsRepository.findOne.mockResolvedValue(mockCat);
      catsRepository.remove.mockResolvedValue(mockCat);
      expect(await service.remove('1', mockUser)).toEqual(mockCat);
    });
  });

  describe('update', () => {
    it('should update a cat by id', async () => {
      catsRepository.findOne.mockResolvedValue(mockCat);
      catsRepository.update.mockResolvedValue(mockCat);
      expect(await service.update('1', {} as UpdateCatDto, mockUser)).toEqual(
        mockCat,
      );
    });
  });
});
