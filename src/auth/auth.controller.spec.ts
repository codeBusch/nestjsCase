import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dtos/login';
import { RegisterDto } from './dtos/register';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

describe('AuthController', () => {
    let authController: AuthController;
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
                        register: jest.fn(),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
                        findOneById: jest.fn(),
                    },
                },
                JwtService,
                ConfigService,
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
    });

    describe('login', () => {
        it('should return an access token', async () => {
            const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
            const token = { access_token: 'token' };

            jest.spyOn(authService, 'login').mockResolvedValue(token);

            expect(await authController.login(loginDto)).toEqual(token);
        });

        it('should throw an UnauthorizedException', async () => {
            const loginDto: LoginDto = { email: 'wrong@example.com', password: 'password' };

            jest.spyOn(authService, 'login').mockRejectedValue(new UnauthorizedException());

            await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('register', () => {
        it('should create a new user', async () => {
            const registerDto: RegisterDto = { email: 'new@example.com', name: 'New', surname: 'User', password: 'password' };
            const createdUser = { id: 1, ...registerDto, balance: 1000, orders: [] } as User;

            jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);

            expect(await authController.register(registerDto)).toEqual(createdUser);
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const req = { user: { sub: 1 } };
            const userProfile: User = {
                id: 1,
                email: 'test@example.com',
                name: 'Test',
                surname: 'User',
                password: 'hashedPassword',
                balance: 1000,
                orders: [],
                hashPassword: jest.fn(),
            };

            jest.spyOn(usersService, 'findOneById').mockResolvedValue(userProfile);

            expect(await authController.getProfile(req)).toEqual(userProfile);
        });

        it('should throw an UnauthorizedException if user not found', async () => {
            const req = { user: { sub: 2 } };

            jest.spyOn(usersService, 'findOneById').mockRejectedValue(new UnauthorizedException());

            await expect(authController.getProfile(req)).rejects.toThrow(UnauthorizedException);
        });
    });
});
