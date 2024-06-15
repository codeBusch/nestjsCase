import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService:OrdersService){}
    @UseGuards(AuthGuard)
    @Post()
    async CreateOrder(@Request() req:any,@Body() createOrderDto:CreateOrderDto){
        return this.ordersService.CreateOrder(createOrderDto,req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Get()
    async ListOrders(@Request() req:any){
        return this.ordersService.GetAllOrders(req.user.sub);
    }
}
