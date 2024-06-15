import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Service } from 'src/services/entity/service.entity';
import { Repository } from 'typeorm';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let userRepository: Repository<User>;
  let serviceRepository: Repository<Service>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Service),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    serviceRepository = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto = { name: 'Order 1', amount: 2, services: [1, 3] };
      const userId = 1;
      const user = { id: 1, balance: 100 } as User;
      const services = [
        { id: 1, price: 5 } as Service,
        { id: 3, price: 2 } as Service,
      ];
      const newOrder = { id: 1, amount: 2, createdBy: user, services } as Order; // Updated

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(serviceRepository, 'findByIds').mockResolvedValue(services);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(newOrder);

      const result = await service.createOrder(createOrderDto, userId);
      expect(result).toBe(newOrder);
      expect(orderRepository.save).toHaveBeenCalledWith({
        amount: createOrderDto.amount, // Updated
        createdBy: user,
        services,
      });
    });

    it('should throw an error if user not found', async () => {
      const createOrderDto = { name: 'Order 1', amount: 2, services: [1, 3] };
      const userId = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createOrder(createOrderDto, userId)).rejects.toThrow(HttpException);
    });

    it('should throw an error if service not found', async () => {
      const createOrderDto = { name: 'Order 1', amount: 2, services: [1, 3] };
      const userId = 1;
      const user = { id: 1, balance: 100 } as User;
      const services = [{ id: 1, price: 5 } as Service];

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(serviceRepository, 'findByIds').mockResolvedValue(services);

      await expect(service.createOrder(createOrderDto, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('GetAllOrders', () => {
    it('should return all orders for the user', async () => {
      const userId = 1;
      const user = { id: 1 } as User;
      const orders = [
        { id: 1, amount: 10, createdBy: user, services: [] } as Order,
        { id: 2, amount: 20, createdBy: user, services: [] } as Order,
      ];

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(orderRepository, 'find').mockResolvedValue(orders);

      const result = await service.GetAllOrders(userId);
      expect(result).toBe(orders);
      expect(orderRepository.find).toHaveBeenCalledWith({ relations: ['services', 'createdBy'] });
    });

    it('should throw an error if user not found', async () => {
      const userId = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.GetAllOrders(userId)).rejects.toThrow(HttpException);
    });
  });
});
