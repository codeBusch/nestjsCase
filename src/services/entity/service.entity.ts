import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, ManyToMany, ManyToOne } from 'typeorm';
import * as argon2 from 'argon2';
import { Order } from 'src/orders/entity/order.entity';
import { Exclude } from 'class-transformer';
@Entity("service")
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;


    @Column()
    price:number;
    
    @Column()
    description:string;
       
    @OneToMany(() => Order, (order) => order.services)
    orders:Order[]
}