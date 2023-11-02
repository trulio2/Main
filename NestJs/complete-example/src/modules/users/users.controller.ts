import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, Role } from '../../decorators';
import { RoleGuard } from '../../guards';
import { Serialize } from '../../interceptors';
import { User } from '../auth/entities';
import { UserDto } from './dtos';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard())
@Role('admin')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private logger = new Logger('UsersController');

  @Get()
  @UseGuards(RoleGuard)
  findAll(@GetUser() user: User): Promise<User[]> {
    this.logger.verbose(`${user.username} - Get All Users`);

    return this.usersService.findAll();
  }
}
