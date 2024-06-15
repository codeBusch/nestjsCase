import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dtos/create-service.dto';
import { Service } from './entity/service.entity';
import { Order } from 'src/orders/entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Order)
        private orderRepository:Repository<Order>,
       
        @InjectRepository(Service)
        private serviceRepository:Repository<Service>
    ){ }
    async createService(createServiceDto: CreateServiceDto): Promise<Service> {
        
       


        let newServiceEntity = new Service();
       
        newServiceEntity.description = createServiceDto.description;

        newServiceEntity.name = createServiceDto.name;
        
        newServiceEntity.price = createServiceDto.price;
        
        return await this.serviceRepository.save(newServiceEntity);
    }
    async getAllServices(){
        const services = {
            "services": [
                {
                    "id": 1,
                    "name": "Standard Shipping",
                    "description": "Basic shipping service with average delivery time.",
                    "price": 5.00
                },
                {
                    "id": 2,
                    "name": "Express Shipping",
                    "description": "Faster delivery service with premium charges.",
                    "price": 15.00
                },
                {
                    "id": 3,
                    "name": "Gift Wrapping",
                    "description": "Special gift wrapping service for special occasions.",
                    "price": 2.50
                },
                {
                    "id": 4,
                    "name": "Installation Service",
                    "description": "Professional installation service for electronic devices.",
                    "price": 30.00
                }
            ]
        }
        
        return services;

    }
}
