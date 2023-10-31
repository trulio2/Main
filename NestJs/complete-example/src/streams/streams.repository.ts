import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities';
import { CreateMessageDto } from './dtos';
import { Message } from './entities';

@Injectable()
export class StreamsRepository {
  constructor(
    @InjectRepository(Message)
    private repository: Repository<Message>,
  ) {}

  create(createMessageDto: CreateMessageDto, user: User): Promise<Message> {
    const message = this.repository.create({
      ...createMessageDto,
      user,
    });

    return this.repository.save(message);
  }

  async findAll(user: User): Promise<Message[]> {
    const query = this.repository.createQueryBuilder('message');

    query.where({ user }).orderBy('message.createdAt', 'ASC');

    const messages = await query.getMany();

    return messages;
  }
}
