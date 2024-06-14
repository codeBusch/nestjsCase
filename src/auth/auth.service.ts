import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { RegisterDto } from './dtos/register';

@Injectable()
export class AuthService {
    constructor(private usersService:UsersService , private jwtService:JwtService){}
    async login(email:string, pass:string){
        const user = await this.usersService.findOne(email);
      
        if(!await argon2.verify(user?.password, pass) ){
            throw new UnauthorizedException();
        }
        const {password , ...result} = user;
        //todo : generate jwt and return it here
        //sub -> jwt standart
        const payLoad = {sub:user.id, email:user.email}
        return {access_token: await this.jwtService.signAsync(payLoad) };
    }
    async register (userDto: RegisterDto){
        return this.usersService.create(userDto);
    }
}
