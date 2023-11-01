import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockCreateMessageDto, mockMessage, mockUser } from '../mocks';
import { Message } from './entities';
import { StreamsRepository } from './streams.repository';

describe('StreamsRepository', () => {
  let repository: StreamsRepository;
  let mockTypeOrmRepository: Repository<Message>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamsRepository,
        {
          provide: getRepositoryToken(Message),
          useFactory: () => ({
            create: jest.fn(),
            createQueryBuilder: jest.fn(),
            save: jest.fn(),
          }),
        },
      ],
    }).compile();

    repository = module.get<StreamsRepository>(StreamsRepository);
    mockTypeOrmRepository = module.get<Repository<Message>>(
      getRepositoryToken(Message),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined', () => {
    expect(mockTypeOrmRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a message', async () => {
      jest.spyOn(mockTypeOrmRepository, 'save').mockResolvedValue(mockMessage);

      const result = await repository.create(mockCreateMessageDto, mockUser);

      expect(result).toEqual(mockMessage);
    });
  });

  describe('findAll', () => {
    it('should return an array of messages', async () => {
      jest.spyOn(mockTypeOrmRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn(),
        orderBy: jest.fn(),
        getMany: jest.fn().mockResolvedValue([mockMessage, mockMessage]),
      } as any);

      const result = await repository.findAll(mockUser);

      expect(result).toEqual([mockMessage, mockMessage]);
    });
  });
});
