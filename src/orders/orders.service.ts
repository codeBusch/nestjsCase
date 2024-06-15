import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository:Repository<Order>,
        @InjectRepository(User)
        private userRepository:Repository<User>){
        }

        
    async CreateOrder(createOrderDto:CreateOrderDto,userId:number){
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        
        if (!user) {
            throw new HttpException({ message: "User not found" }, HttpStatus.NOT_FOUND);
        }
        
        let newOrderEntity = new Order();
        newOrderEntity.name= createOrderDto.name;
        newOrderEntity.price= createOrderDto.price;
        newOrderEntity.amount= createOrderDto.amount;
        newOrderEntity.createdBy =user;
        let orderTotal= newOrderEntity.amount * newOrderEntity.price;
        
        

    
        if (user.balance - orderTotal < 0) {
            throw new HttpException({ message: "Insufficient balance" }, HttpStatus.BAD_REQUEST);
        }

        user.balance -= orderTotal;
        await this.userRepository.save(user);
        const savedOrder = await this.orderRepository.save(newOrderEntity);
        return savedOrder;
   
        
    }
    async GetAllOrders(userId:number){
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        console.log(user);
        
        
        if (!user) {
            throw new HttpException({ message: "User not found" }, HttpStatus.NOT_FOUND);
        }
       
        const orders = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.createdBy', 'user')
        .where('user.id = :userId', { userId })
        .getMany();
  
        
        
        return orders;
    }
    
}
