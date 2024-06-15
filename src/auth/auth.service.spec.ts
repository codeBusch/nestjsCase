import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dtos/register';
import { User } from '../users/entities/user.entity';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        password: await argon2.hash('testPassword'),
        name: 'Test',
        surname: 'User',
        balance: 1000,
        orders: [],
        hashPassword: jest.fn(),
      };

      const mockToken = 'mockToken';
      const loginDto = { email: 'test@test.com', password: 'testPassword' };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await service.login(loginDto.email, loginDto.password);

      expect(result).toEqual({ access_token: mockToken });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(argon2.verify).toHaveBeenCalledWith(mockUser.password, loginDto.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        password: await argon2.hash('testPassword'),
        name: 'Test',
        surname: 'User',
        balance: 1000,
        orders: [],
        hashPassword: jest.fn(),
      };

      const loginDto = { email: 'test@test.com', password: 'wrongPassword' };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(service.login(loginDto.email, loginDto.password)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(argon2.verify).toHaveBeenCalledWith(mockUser.password, loginDto.password);
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@test.com',
        password: 'testPassword',
        name: 'Test',
        surname: 'User',
      };

      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        password: await argon2.hash(registerDto.password),
        name: 'Test',
        surname: 'User',
        balance: 1000,
        orders: [],
        hashPassword: jest.fn(),
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toEqual(mockUser);
      expect(usersService.create).toHaveBeenCalledWith(registerDto);
    });
  });
});
