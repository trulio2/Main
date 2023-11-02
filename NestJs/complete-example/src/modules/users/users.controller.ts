import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../decorators';
import { RoleGuard } from '../../guards';
import { Serialize } from '../../interceptors';
import { User } from '../auth/entities';
import { UserDto } from './dtos';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard())
@Serialize(UserDto)
@Role('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RoleGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
