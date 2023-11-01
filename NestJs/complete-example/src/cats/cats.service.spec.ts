import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../auth/entities';
import { CatsRepository } from './cats.repository';
import { CatsService } from './cats.service';
import { CreateCatDto, GetCatsFilterDto, UpdateCatDto } from './dtos';
import { Cat } from './entities';

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

      expect(await service.findOne('uuid', mockUser)).toEqual(mockCat);
    });

    it('should throw an error if cat is not found', async () => {
      catsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('uuid', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a cat by id', async () => {
      catsRepository.findOne.mockResolvedValue(mockCat);
      catsRepository.remove.mockResolvedValue(mockCat);

      expect(await service.remove('uuid', mockUser)).toEqual(mockCat);
    });
    it('should throw an error if cat is not found', async () => {
      catsRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('uuid', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a cat by id', async () => {
      catsRepository.findOne.mockResolvedValue(mockCat);
      catsRepository.update.mockResolvedValue(mockCat);

      expect(
        await service.update('uuid', {} as UpdateCatDto, mockUser),
      ).toEqual(mockCat);
    });
    it('should throw an error if cat is not found', async () => {
      catsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('uuid', {} as UpdateCatDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
