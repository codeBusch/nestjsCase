import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}