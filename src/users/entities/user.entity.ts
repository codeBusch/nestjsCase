import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as argon2 from 'argon2';
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
    @Column()
    password:string;
    @BeforeInsert()
    async hashPassword(){
        this.password = await argon2.hash(this.password)
    }
}