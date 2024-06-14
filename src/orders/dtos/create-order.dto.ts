import { IsNotEmpty, IsPositive, Min } from "class-validator"
import { User } from "src/users/entities/user.entity"

export class CreateOrderDto{
    @IsNotEmpty()
    name:string
    @Min(1)
    amount:number
    @IsPositive()
    price:number
    
}