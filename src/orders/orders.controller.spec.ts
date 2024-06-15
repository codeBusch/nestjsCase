import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            CreateOrder: jest.fn(),
            GetAllOrders: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({
      canActivate: jest.fn().mockReturnValue(true),
    })
    .compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CreateOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        name: 'Test Order',
        price: 10,
        amount: 2,
      };
      const userId = 1;
      const mockReturnValue = {
        id: 1,
        name: createOrderDto.name,
        price: createOrderDto.price,
        amount: createOrderDto.amount,
        createdBy: { id: userId } as any,
      };

      jest.spyOn(ordersService, 'CreateOrder').mockResolvedValue(mockReturnValue);

      const result = await controller.CreateOrder({ user: { sub: userId } }, createOrderDto);

      expect(result).toEqual(mockReturnValue);
      expect(ordersService.CreateOrder).toHaveBeenCalledWith(createOrderDto, userId);
    });

    it('should throw an error if user not found', async () => {
      const createOrderDto: CreateOrderDto = {
        name: 'Test Order',
        price: 10,
        amount: 2,
      };
      const userId = 1;

      jest.spyOn(ordersService, 'CreateOrder').mockImplementation(() => {
        throw new HttpException({ message: "User not found" }, HttpStatus.NOT_FOUND);
      });

      await expect(controller.CreateOrder({ user: { sub: userId } }, createOrderDto)).rejects.toThrow(HttpException);
      expect(ordersService.CreateOrder).toHaveBeenCalledWith(createOrderDto, userId);
    });
  });

  describe('ListOrders', () => {
    it('should return list of orders for a user', async () => {
      const userId = 1;
      const mockOrders = [
        {
          id: 1,
          name: 'Order 1',
          price: 15,
          amount: 3,
          createdBy: { id: userId } as any,
        },
        {
          id: 2,
          name: 'Order 2',
          price: 20,
          amount: 1,
          createdBy: { id: userId } as any,
        },
      ];

      jest.spyOn(ordersService, 'GetAllOrders').mockResolvedValue(mockOrders);

      const result = await controller.ListOrders({ user: { sub: userId } });

      expect(result).toEqual(mockOrders);
      expect(ordersService.GetAllOrders).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if user not found', async () => {
      const userId = 1;

      jest.spyOn(ordersService, 'GetAllOrders').mockImplementation(() => {
        throw new HttpException({ message: "User not found" }, HttpStatus.NOT_FOUND);
      });

      await expect(controller.ListOrders({ user: { sub: userId } })).rejects.toThrow(HttpException);
      expect(ordersService.GetAllOrders).toHaveBeenCalledWith(userId);
    });
  });
});
