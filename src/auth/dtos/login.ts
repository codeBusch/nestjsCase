import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
export class LoginDto{
    @IsEmail()
    email:string;

    @MinLength(8)
    @MaxLength(32)
    password:string;
}