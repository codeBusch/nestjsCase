import { IsNotEmpty, IsPositive, Min } from "class-validator"
import { Service } from "src/services/entity/service.entity"
import { User } from "src/users/entities/user.entity"

export class CreateOrderDto{
    @IsNotEmpty()
    name:string

    @Min(1)
    amount:number
    
    @IsNotEmpty()
    serviceIds:number[]
    

}