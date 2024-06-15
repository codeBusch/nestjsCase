import { Service } from 'src/services/entity/service.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity("order")
export class Order {
    @PrimaryGeneratedColumn()
    id: number;



    @Column()
    amount:number;
    
    @ManyToOne(() => User, (user) => user.orders)
    createdBy:User;
    
    @ManyToOne(()=> Service, (service) =>service.orders)
    services: Service[];
}