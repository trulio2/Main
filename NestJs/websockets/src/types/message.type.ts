export interface Message {
  role: Role;
  content: string;
}

export enum Role {
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  USER = 'user',
}
