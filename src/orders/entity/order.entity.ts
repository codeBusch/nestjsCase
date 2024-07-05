import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
import { Service } from 'src/services/entity/service.entity';
import { User } from 'src/users/entities/user.entity';

@Entity("order")
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @ManyToOne(() => User, (user) => user.orders, {onDelete:'CASCADE'})
    createdBy: User;

    @ManyToMany(() => Service, (service) => service.orders, {onDelete:'CASCADE'})
    services: Service[];
}
