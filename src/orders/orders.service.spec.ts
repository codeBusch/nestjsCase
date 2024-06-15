import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Service } from 'src/services/entity/service.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';

describe('OrdersService', () => {
    let ordersService: OrdersService;
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

        ordersService = module.get<OrdersService>(OrdersService);
        orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        serviceRepository = module.get<Repository<Service>>(getRepositoryToken(Service));
    });

    describe('createOrder', () => {
        it('should create a new order', async () => {
            const createOrderDto: CreateOrderDto = { name: 'Test Order', amount: 1, services: [1, 2] };
            const userId = 1;
            const user = { id: userId, balance: 200, orders: [] } as User;
            const service1 = { id: 1, price: 50 } as Service;
            const service2 = { id: 2, price: 50 } as Service;
            const order = { id: 1, amount: createOrderDto.amount, createdBy: user, services: [service1, service2] } as Order;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(serviceRepository, 'findByIds').mockResolvedValue([service1, service2]);
            jest.spyOn(orderRepository, 'save').mockResolvedValue(order);
            jest.spyOn(userRepository, 'save').mockResolvedValue(user);

            expect(await ordersService.createOrder(createOrderDto, userId)).toEqual(order);
        });

        it('should throw an HttpException if user not found', async () => {
            const createOrderDto: CreateOrderDto = { name: 'Test Order', amount: 1, services: [1, 2] };
            const userId = 1;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(ordersService.createOrder(createOrderDto, userId)).rejects.toThrow(HttpException);
        });

        it('should throw a NotFoundException if services not found', async () => {
            const createOrderDto: CreateOrderDto = { name: 'Test Order', amount: 1, services: [1, 2] };
            const userId = 1;
            const user = { id: userId, balance: 200, orders: [] } as User;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(serviceRepository, 'findByIds').mockResolvedValue([]);

            await expect(ordersService.createOrder(createOrderDto, userId)).rejects.toThrow(NotFoundException);
        });

        it('should throw an HttpException if user has insufficient balance', async () => {
            const createOrderDto: CreateOrderDto = { name: 'Test Order', amount: 1, services: [1, 2] };
            const userId = 1;
            const user = { id: userId, balance: 50, orders: [] } as User;
            const service1 = { id: 1, price: 50 } as Service;
            const service2 = { id: 2, price: 50 } as Service;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(serviceRepository, 'findByIds').mockResolvedValue([service1, service2]);

            await expect(ordersService.createOrder(createOrderDto, userId)).rejects.toThrow(HttpException);
        });
    });

    describe('GetAllOrders', () => {
        it('should return all orders', async () => {
            const userId = 1;
            const user = { id: userId, orders: [] } as User;
            const order = { id: 1, amount: 1, createdBy: user, services: [] } as Order;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(orderRepository, 'find').mockResolvedValue([order]);

            expect(await ordersService.GetAllOrders(userId)).toEqual([order]);
        });

        it('should throw an HttpException if user not found', async () => {
            const userId = 1;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(ordersService.GetAllOrders(userId)).rejects.toThrow(HttpException);
        });
    });
});
