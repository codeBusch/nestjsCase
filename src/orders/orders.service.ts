import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './entity/order.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Service } from 'src/services/entity/service.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository:Repository<Order>,
        @InjectRepository(User)
        private userRepository:Repository<User>,
        @InjectRepository(Service)
        private serviceRepository:Repository<Service>
    ){ }

    async createOrder(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new HttpException({ message: "User not found" }, HttpStatus.NOT_FOUND);
        }

        const services = await this.serviceRepository.find({
            where: { id: In(createOrderDto.serviceIds) }
        });

        if (services.length === 0) {
            throw new HttpException({ message: "No services found" }, HttpStatus.NOT_FOUND);
        }

        let newOrderEntity = new Order();
        newOrderEntity.amount = createOrderDto.amount;
        newOrderEntity.createdBy = user;
        newOrderEntity.services = services;
        console.log(newOrderEntity);
        
       return await this.orderRepository.save(newOrderEntity);
    }
    
    async GetAllOrders(userId:number){
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
       
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
