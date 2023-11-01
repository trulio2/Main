import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../auth/entities';
import { CatsResolver } from './cats.resolver';
import { CatsService } from './cats.service';
import { CreateCatDto, GetCatsFilterDto } from './dtos';
import { Cat } from './entities';

jest.mock('./cats.service');

describe('CatsResolver', () => {
  let resolver: CatsResolver;
  let catsService: jest.Mocked<CatsService>;
  let mockUser = { username: 'test' } as User;
  let mockCat: Cat;

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
    catsService = module.get(CatsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('create', () => {
    it('should create a cat', async () => {
      catsService.create.mockResolvedValue(mockCat);

      expect(await resolver.create({} as CreateCatDto, mockUser)).toEqual(
        mockCat,
      );
    });
  });

  describe('findAll', () => {
    it('should find all cats', async () => {
      catsService.findAll.mockResolvedValue([mockCat]);

      expect(await resolver.findAll({} as GetCatsFilterDto, mockUser)).toEqual([
        mockCat,
      ]);
    });
  });

  describe('findOne', () => {
    it('should find one cat by id', async () => {
      catsService.findOne.mockResolvedValue(mockCat);

      expect(await resolver.findOne('uuid', mockUser)).toEqual(mockCat);
    });
  });

  describe('remove', () => {
    it('should remove a cat', async () => {
      catsService.remove.mockResolvedValue(mockCat);

      expect(await resolver.remove('uuid', mockUser)).toEqual(mockCat);
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      catsService.update.mockResolvedValue(mockCat);

      expect(
        await resolver.update('uuid', {} as CreateCatDto, mockUser),
      ).toEqual(mockCat);
    });
  });
});
