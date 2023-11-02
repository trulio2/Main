import { Role } from '.';

export interface OpenAiInputMessage {
  content: string;
  role: Role;
}
