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
        
        
        return this.serviceRepository.find();

    }
}
