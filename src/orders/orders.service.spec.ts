import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            }),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CreateOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        name: 'Test Order',
        price: 10,
        amount: 2,
      };
      const userId = 1;
      const mockUser = {
        id: userId,
        balance: 100,
      } as User;
      const mockSavedOrder = {
        id: 1,
        ...createOrderDto,
        createdBy: mockUser,
      } as Order;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(mockSavedOrder);

      const result = await service.CreateOrder(createOrderDto, userId);

      expect(result).toEqual(mockSavedOrder);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(orderRepository.save).toHaveBeenCalledWith(expect.objectContaining(createOrderDto));
    });

    it('should throw an error if user not found', async () => {
      const createOrderDto: CreateOrderDto = {
        name: 'Test Order',
        price: 10,
        amount: 2,
      };
      const userId = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.CreateOrder(createOrderDto, userId)).rejects.toThrow(HttpException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should throw an error if user has insufficient balance', async () => {
      const createOrderDto: CreateOrderDto = {
        name: 'Test Order',
        price: 10,
        amount: 2,
      };
      const userId = 1;
      const mockUser = {
        id: userId,
        balance: 10,
      } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(service.CreateOrder(createOrderDto, userId)).rejects.toThrow(HttpException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });

  describe('GetAllOrders', () => {
    it('should return list of orders for a user', async () => {
      const userId = 1;
      const mockUser = { id: userId } as User;
      const mockOrders = [
        {
          id: 1,
          name: 'Order 1',
          price: 15,
          amount: 3,
          createdBy: mockUser,
        },
        {
          id: 2,
          name: 'Order 2',
          price: 20,
          amount: 1,
          createdBy: mockUser,
        },
      ];

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      const queryBuilderMock = orderRepository.createQueryBuilder();
      jest.spyOn(queryBuilderMock, 'getMany').mockResolvedValue(mockOrders);

      const result = await service.GetAllOrders(userId);

      expect(result).toEqual(mockOrders);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith('order.createdBy', 'user');
      expect(queryBuilderMock.where).toHaveBeenCalledWith('user.id = :userId', { userId });
    });

    it('should throw an error if user not found', async () => {
      const userId = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.GetAllOrders(userId)).rejects.toThrow(HttpException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });
});
