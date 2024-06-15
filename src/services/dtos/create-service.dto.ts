import { IsNotEmpty, Min } from "class-validator"
import { PrimaryGeneratedColumn } from "typeorm";


export class CreateServiceDto{
   
    
    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    description:string;

    @Min(1)
    price:number
    
  
    
}

