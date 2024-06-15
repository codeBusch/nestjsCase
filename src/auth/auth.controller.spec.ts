import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dtos/register';
import { LoginDto } from './dtos/login';
import { User } from 'src/users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const result = { access_token: 'mockToken' };
      const loginDto: LoginDto = { email: 'test@test.com', password: 'testPassword' };

      jest.spyOn(authService, 'login').mockImplementation(async () => result);

      expect(await controller.login(loginDto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const result: User = {
        id: 1,
        email: 'test@test.com',
        password: 'testPassword',
        name: 'Test',
        surname: 'User',
        balance: 1000,
        orders: [],
        hashPassword: jest.fn(),
      };

      const registerDto: RegisterDto = {
        email: 'test@test.com',
        password: 'testPassword',
        name: 'Test',
        surname: 'User',
      };

      jest.spyOn(usersService, 'create').mockImplementation(async () => result);

      expect(await controller.register(registerDto)).toBe(result);
      expect(usersService.create).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const result: User = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test',
        surname: 'User',
        balance: 1000,
        orders: [],
        hashPassword: jest.fn(),
      };
      const request = { user: { sub: 1 } };

      jest.spyOn(usersService, 'findOneById').mockImplementation(async () => result);

      expect(await controller.getProfile(request)).toBe(result);
      expect(usersService.findOneById).toHaveBeenCalledWith(request.user.sub);
    });
  });
});
