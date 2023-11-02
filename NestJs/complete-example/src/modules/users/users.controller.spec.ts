import { Test, TestingModule } from '@nestjs/testing';
import { mockUser } from '../../mocks';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('./users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let mockService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersController,
        {
          provide: UsersService,
          useFactory: () => ({
            findAll: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    mockService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      mockService.findAll.mockResolvedValue([mockUser, mockUser]);

      const result = await controller.findAll(mockUser);

      expect(result).toEqual([mockUser, mockUser]);
    });
  });
});
