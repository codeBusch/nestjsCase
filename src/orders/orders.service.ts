import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
    private calculateTotalPrice(services: Service[], amount: number): number {
        return services.reduce((total, service) => total + (service.price * amount), 0);
    }

    async createOrder(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
        const { amount, services } = createOrderDto;

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new HttpException({ message: "User not found" }, HttpStatus.NOT_FOUND);
        }

        const dbServices = await this.serviceRepository.findByIds(services);
        if (dbServices.length !== services.length) {
            const notFoundIds = services.filter(id => !dbServices.some(service => service.id === id));
            throw new NotFoundException(`Services with IDs ${notFoundIds.join(', ')} not found`);
        }
        
        const totalAmount = this.calculateTotalPrice(dbServices, amount);
        if(user.balance<totalAmount){
            throw new HttpException({ message: "Insufficient balance" }, HttpStatus.BAD_REQUEST);
        }


        if (services.length === 0) {
            throw new HttpException({ message: "No services found" }, HttpStatus.NOT_FOUND);
        }

        let newOrderEntity = new Order();
        newOrderEntity.amount = createOrderDto.amount;
        newOrderEntity.createdBy = user;
        newOrderEntity.services = dbServices;
        
        
       return await this.orderRepository.save(newOrderEntity);
    }
    
    async GetAllOrders(userId:number){
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
       
        if (!user) {
            throw new HttpException({ message: "User not found" }, HttpStatus.NOT_FOUND);
        }
       
        return this.orderRepository.find({ relations: ['services', 'createdBy'] });

    }
    
}
