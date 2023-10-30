import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { User } from './entities';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UsersService } from './users.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  private readonly logger = new Logger('UsersController');

  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.create(createUserDto);

    this.logger.verbose(`User created: ${JSON.stringify(user)}`);

    return user;
  }

  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();

    this.logger.verbose(`Users found: ${JSON.stringify(users)}`);

    return users;
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const user = await this.usersService.findOne(id);

    this.logger.verbose(`User found: ${JSON.stringify(user)}`);

    return user;
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const user = await this.usersService.remove(id);

    this.logger.verbose(`User deleted: ${JSON.stringify(user)}`);

    return user;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.update(id, updateUserDto);

    this.logger.verbose(`User updated: ${JSON.stringify(user)}`);

    return user;
  }
}
