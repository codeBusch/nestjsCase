import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entity/order.entity';
import { Service } from './entity/service.entity';

@Module({
  providers: [ServicesService],
  controllers: [ServicesController],
  imports:[TypeOrmModule.forFeature([Order,Service])]
})
export class ServicesModule {}
