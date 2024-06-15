import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('OrdersController', () => {
    let ordersController: OrdersController;
    let ordersService: OrdersService;

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
                JwtService,
                ConfigService,
            ],
        }).compile();

        ordersController = module.get<OrdersController>(OrdersController);
        ordersService = module.get<OrdersService>(OrdersService);
    });

    describe('createOrder', () => {
        it('should create a new order', async () => {
            const createOrderDto: CreateOrderDto = { name: 'Test Order', amount: 1, services: [1, 2] };
            const req = { user: { sub: 1 } };
            const result = { id: 1, amount: createOrderDto.amount, createdBy: req.user, services: createOrderDto.services } as any;

            jest.spyOn(ordersService, 'createOrder').mockResolvedValue(result);

            expect(await ordersController.createOrder(req, createOrderDto)).toEqual(result);
            expect(ordersService.createOrder).toHaveBeenCalledWith(createOrderDto, req.user.sub);
        });

        it('should throw an UnauthorizedException if not authenticated', async () => {
            const createOrderDto: CreateOrderDto = { name: 'Test Order', amount: 1, services: [1, 2] };
            const req = {}; 

            await expect(ordersController.createOrder(req, createOrderDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('ListOrders', () => {
        it('should return all orders', async () => {
            const req = { user: { sub: 1 } };
            const result = [{ id: 1, amount: 1, createdBy: req.user, services: [1, 2] }] as any;

            jest.spyOn(ordersService, 'GetAllOrders').mockResolvedValue(result);

            expect(await ordersController.ListOrders(req)).toEqual(result);
            expect(ordersService.GetAllOrders).toHaveBeenCalledWith(req.user.sub);
        });

        it('should throw an UnauthorizedException if not authenticated', async () => {
            const req = {}; 
            await expect(ordersController.ListOrders(req)).rejects.toThrow(UnauthorizedException);
        });
    });
});
