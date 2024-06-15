import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Order } from './entity/order.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { ServicesModule } from 'src/services/services.module';
import { Service } from 'src/services/entity/service.entity';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports:[TypeOrmModule.forFeature([Order,User,Service])],
})
export class OrdersModule {}
