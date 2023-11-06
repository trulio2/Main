import { Cat } from './cat.entity';

export class User {
  id: string;
  name: string;
  cats?: Cat[];
}
