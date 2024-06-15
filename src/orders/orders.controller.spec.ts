import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './entity/order.entity';
import { JwtService } from '@nestjs/jwt';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            createOrder: jest.fn(),
            GetAllOrders: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = { name: 'Order 1', amount: 2, services: [1, 3] };
      const req = { user: { sub: 1 } };
      const newOrder = { id: 1, amount: 2 } as Order;

      jest.spyOn(service, 'createOrder').mockResolvedValue(newOrder);

      const result = await controller.createOrder(req, createOrderDto);
      expect(result).toBe(newOrder);
      expect(service.createOrder).toHaveBeenCalledWith(createOrderDto, req.user.sub);
    });
  });

  describe('ListOrders', () => {
    it('should return all orders for the user', async () => {
      const req = { user: { sub: 1 } };
      const orders = [
        { id: 1, amount: 10, services: [] } as Order,
        { id: 2, amount: 20, services: [] } as Order,
      ];

      jest.spyOn(service, 'GetAllOrders').mockResolvedValue(orders);

      const result = await controller.ListOrders(req);
      expect(result).toBe(orders);
      expect(service.GetAllOrders).toHaveBeenCalledWith(req.user.sub);
    });
  });
});
