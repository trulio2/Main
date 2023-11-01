import { Test, TestingModule } from '@nestjs/testing';
import OpenAI from 'openai';
import { mockChatResponse, mockChatCompletionsResponse } from '../mocks';
import { OpenaiService } from './openai.service';

describe('OpenaiService', () => {
  let service: OpenaiService;
  let mockOpenAi: OpenAI;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenaiService,
        {
          provide: OpenAI,
          useFactory: () => ({
            chat: {
              completions: {
                create: jest.fn(),
              },
            },
          }),
        },
      ],
    }).compile();

    service = module.get<OpenaiService>(OpenaiService);
    mockOpenAi = module.get(OpenAI);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(mockOpenAi).toBeDefined();
  });

  describe('chat', () => {
    it('should return a message', async () => {
      jest
        .spyOn(mockOpenAi.chat.completions, 'create')
        .mockResolvedValue(mockChatCompletionsResponse);

      const result = await service.chat([], 0);

      expect(result).toEqual(mockChatResponse);
    });
  });

  describe('stream', () => {
    it('should return a stream', async () => {
      jest
        .spyOn(mockOpenAi.chat.completions, 'create')
        .mockResolvedValue(mockChatCompletionsResponse);

      const result = await service.stream([], 0);

      expect(result).toEqual(mockChatCompletionsResponse);
    });
  });
});
