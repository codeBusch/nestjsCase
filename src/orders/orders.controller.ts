import { Body, Controller, Post, UseGuards, Request, Get, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService:OrdersService){}
    @UseGuards(AuthGuard)
    @Post()
    async createOrder(@Request() req:any,@Body() createOrderDto:CreateOrderDto){
        if (!req.user) {
            throw new UnauthorizedException();
        }

        return this.ordersService.createOrder(createOrderDto,req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Get()
    async ListOrders(@Request() req:any){
        if (!req.user) {
            throw new UnauthorizedException();
        }
        
        return this.ordersService.GetAllOrders(req.user.sub);
    }
}
