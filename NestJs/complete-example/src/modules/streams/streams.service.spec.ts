import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { mockMessage, mockStreamMessage, mockUser } from '../../mocks';
import { OpenaiService } from '../openai/openai.service';
import { StreamsRepository } from './streams.repository';
import { StreamsService } from './streams.service';

jest.mock('./streams.repository');
jest.mock('../openai/openai.service');

describe('StreamsService', () => {
  let service: StreamsService;
  let mockRepository: jest.Mocked<StreamsRepository>;
  let mockOpenaiService: jest.Mocked<OpenaiService>;
  let mockClient: jest.Mocked<Socket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamsService,
        {
          provide: StreamsRepository,
          useFactory: () => ({
            create: jest.fn(),
            findAll: jest.fn(),
          }),
        },
        {
          provide: OpenaiService,
          useFactory: () => ({
            stream: jest.fn(),
          }),
        },
        {
          provide: Socket,
          useFactory: () => ({
            emit: jest.fn(),
            disconnect: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<StreamsService>(StreamsService);
    mockRepository = module.get(StreamsRepository);
    mockOpenaiService = module.get(OpenaiService);
    mockClient = module.get(Socket);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of messages', async () => {
      mockRepository.findAll.mockResolvedValue([mockMessage, mockMessage]);

      const result = await service.findAll(mockUser);

      expect(result).toEqual([mockMessage, mockMessage]);
    });
  });

  describe('stream', () => {
    it('should return an array of messages', async () => {
      mockOpenaiService.stream.mockResolvedValue([
        {
          choices: [
            {
              delta: {
                content: 'Mock content',
              },
            },
          ],
        },
      ] as any);

      await service.stream(mockStreamMessage, mockClient, mockUser);

      expect(mockClient.emit).toHaveBeenCalled();
      expect(mockClient.disconnect).toHaveBeenCalled();
    });
  });
});
