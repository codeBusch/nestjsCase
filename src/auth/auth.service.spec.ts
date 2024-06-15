import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dtos/register';
import { User } from 'src/users/entities/user.entity';

jest.mock('argon2', () => ({
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

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
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const email = 'test@example.com';
      const password = 'password';

      const user = { id: 1, email, password: 'hashedPassword' } as User;

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const result = await authService.login(email, password);

      expect(result).toEqual({ access_token: 'token' });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(argon2.verify).toHaveBeenCalledWith(user.password, password);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: user.id, email: user.email },
        { secret: 'test-secret' },
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'password';

      const user = { id: 1, email, password: 'hashedPassword' } as User;

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(argon2.verify).toHaveBeenCalledWith(user.password, password);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password';

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'new@example.com',
        name: 'New',
        surname: 'User',
        password: 'password',
      };

      const user = { id: 1, ...registerDto } as User;

      jest.spyOn(usersService, 'create').mockResolvedValue(user);

      const result = await authService.register(registerDto);

      expect(result).toEqual(user);
      expect(usersService.create).toHaveBeenCalledWith(registerDto);
    });
  });
});
