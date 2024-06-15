import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from 'typeorm';
import * as argon2 from 'argon2';
import { Order } from 'src/orders/entity/order.entity';
import { Exclude } from 'class-transformer';
@Entity("user")
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name:string;
    @Column()
    surname:string;
    @Column()
    email:string;
   
    //@Exclude({ toPlainOnly: true }) //TODO implement hide password 
    
    @Column({select:false})
    password:string;
    @Column({default:1000})
    balance:number;
    @BeforeInsert()
    async hashPassword(){
        this.password = await argon2.hash(this.password)
    }
    @OneToMany(() => Order, (order) => order.createdBy)
    orders:Order[]
}