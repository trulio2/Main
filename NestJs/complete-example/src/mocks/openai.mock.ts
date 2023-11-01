import { ChatCompletion } from 'openai/resources';

export const mockChatResponse = 'Mock Chat Response';
export const mockChatCompletionsResponse = {
  choices: [
    {
      message: {
        content: mockChatResponse,
      },
    },
  ],
} as ChatCompletion;
