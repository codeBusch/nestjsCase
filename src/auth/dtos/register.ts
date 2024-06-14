import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
export class RegisterDto{
    @IsNotEmpty()
    name:string;

    @IsNotEmpty()
    surname:string;

    @IsEmail()
    email:string;

    @MinLength(8)
    @MaxLength(32)
    password:string;
}