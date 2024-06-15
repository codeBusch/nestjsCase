import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity("order")
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column()
    price:number;

    @Column()
    amount:number;
    
    @ManyToOne(() => User, (user) => user.orders)
    createdBy:User;

}