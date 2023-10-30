import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Concept {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  definition: string;

  @Column({ nullable: true })
  comment: string;
}
