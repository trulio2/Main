import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../../types';
import { Cat } from '../../cats/entities';
import { Message } from '../../streams/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  role: UserRole;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Cat, (cat) => cat.user)
  cats: Cat[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
