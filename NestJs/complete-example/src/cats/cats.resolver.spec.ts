import { Test, TestingModule } from '@nestjs/testing';
import {
  mockCat,
  mockCreateCatDto,
  mockGetCatsFilterDto,
  mockUser,
} from '../mocks';
import { CatsResolver } from './cats.resolver';
import { CatsService } from './cats.service';

jest.mock('./cats.service');

describe('CatsResolver', () => {
  let resolver: CatsResolver;
  let mockService: jest.Mocked<CatsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsResolver,
        {
          provide: CatsService,
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

    resolver = module.get<CatsResolver>(CatsResolver);
    mockService = module.get(CatsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('create', () => {
    it('should create a cat', async () => {
      mockService.create.mockResolvedValue(mockCat);

      const result = await resolver.create(mockCreateCatDto, mockUser);

      expect(result).toEqual(mockCat);
    });
  });

  describe('findAll', () => {
    it('should find all cats', async () => {
      mockService.findAll.mockResolvedValue([mockCat, mockCat]);

      const result = await resolver.findAll(mockGetCatsFilterDto, mockUser);

      expect(result).toEqual([mockCat, mockCat]);
    });
  });

  describe('findOne', () => {
    it('should find one cat by id', async () => {
      mockService.findOne.mockResolvedValue(mockCat);

      const result = await resolver.findOne('uuid', mockUser);

      expect(result).toEqual(mockCat);
    });
  });

  describe('remove', () => {
    it('should remove a cat', async () => {
      mockService.remove.mockResolvedValue(mockCat);

      const result = await resolver.remove('uuid', mockUser);

      expect(result).toEqual(mockCat);
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      mockService.update.mockResolvedValue(mockCat);

      const result = await resolver.update('uuid', mockCreateCatDto, mockUser);

      expect(result).toEqual(mockCat);
    });
  });
});
