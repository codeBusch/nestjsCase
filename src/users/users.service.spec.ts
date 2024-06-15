import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dtos/register';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
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
        password: 'hashedPassword',
        name: 'Test',
        surname: 'User',
        balance: 1000,
        orders: [],
        hashPassword: jest.fn(),
      };

      jest.spyOn(repository, 'save').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      } as any);

      const result = await service.create(registerDto);

      expect(result).toEqual(mockUser);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        email: registerDto.email,
        name: registerDto.name,
        surname: registerDto.surname,
      }));
    });

    it('should throw an error if email already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'test@test.com',
        password: 'testPassword',
        name: 'Test',
        surname: 'User',
      };

      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test',
        surname: 'User',
        balance: 1000,
        orders: [],
        hashPassword: jest.fn(),
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      } as any);

      await expect(service.create(registerDto)).rejects.toThrow(
        new HttpException({ message: 'email must be unique' }, HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@test.com';

      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test',
        surname: 'User',
        balance: 1000,
        orders: [],
        hashPassword: jest.fn(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.findOneByEmail(email);

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email }, select: ['email', 'password', 'id'] });
    });

    it('should throw an error if user not found', async () => {
      const email = 'test@test.com';

      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOneByEmail(email)).rejects.toThrow(
        new HttpException({ message: 'Email not found' }, HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const id = 1;

      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test',
        surname: 'User',
        balance: 1000,
        orders: [],
        hashPassword: jest.fn(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.findOneById(id);

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw an error if user not found', async () => {
      const id = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOneById(id)).rejects.toThrow(
        new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND)
      );
    });
  });
});
