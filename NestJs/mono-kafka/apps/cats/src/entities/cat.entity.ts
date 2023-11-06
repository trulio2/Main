import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;

  @Column()
  userId: string;

  toString() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      age: this.age,
      breed: this.breed,
      userId: this.userId,
    });
  }
}
