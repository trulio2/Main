import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { mockMessage, mockStreamMessage, mockUser } from '../../mocks';
import { StreamsGateway } from './streams.gateway';
import { StreamsService } from './streams.service';

jest.mock('./streams.service');

describe('StreamsGateway', () => {
  let gateWay: StreamsGateway;
  let mockService: jest.Mocked<StreamsService>;
  let mockClient: jest.Mocked<Socket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamsGateway,
        {
          provide: StreamsService,
          useFactory: () => ({
            findAll: jest.fn(),
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

    gateWay = module.get<StreamsGateway>(StreamsGateway);
    mockService = module.get(StreamsService);
    mockClient = module.get(Socket);
  });

  it('should be defined', () => {
    expect(gateWay).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of messages', async () => {
      mockService.findAll.mockResolvedValue([mockMessage, mockMessage]);

      expect(await gateWay.findAll(mockUser)).toEqual([
        mockMessage,
        mockMessage,
      ]);
    });
  });

  describe('stream', () => {
    it('should call stream', () => {
      gateWay.handleStream(mockStreamMessage, mockClient, mockUser);

      expect(mockService.stream).toHaveBeenCalledWith(
        mockStreamMessage,
        mockClient,
        mockUser,
      );
    });
  });
});
