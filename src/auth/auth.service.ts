import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { RegisterDto } from './dtos/register';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private usersService:UsersService , private jwtService:JwtService,private configService: ConfigService){}
    
    async login(email:string, pass:string){
    
        const user = await this.usersService.findOneByEmail(email);
    
        if(!await argon2.verify(user?.password, pass) ){
            throw new UnauthorizedException();
        }
        const {password , ...result} = user;
        //sub -> jwt standart
        const payLoad = {sub:user.id, email:user.email}
        const token = await this.jwtService.signAsync(payLoad, {
            secret: this.configService.get<string>('JWT_SECRET'),
          });
        
        return {access_token: token };
    }

    async register (userDto: RegisterDto){
        return this.usersService.create(userDto);
    }
}
