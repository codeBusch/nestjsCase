import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Order } from 'src/orders/entity/order.entity';

@Entity("service")
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @ManyToMany(() => Order, (order) => order.services)
    @JoinTable()
    orders: Order[];
}
