import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../auth/entities';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

jest.mock('./users.service');

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: jest.Mocked<UsersService>;
  let mockUser = { username: 'test' } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useFactory: () => ({
            findAll: jest.fn(),
          }),
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      usersService.findAll.mockResolvedValue([mockUser, mockUser]);

      const result = await resolver.findAllUsers(mockUser);

      expect(result).toEqual([mockUser, mockUser]);
    });
  });
});
