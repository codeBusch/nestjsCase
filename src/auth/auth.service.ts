import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService:UsersService , private jwtService:JwtService){}
    async signIn(email:string, pass:string){
        const user = await this.usersService.findOne(email);
        if(user?.password !== pass){
            throw new UnauthorizedException();
        }
        const {password , ...result} = user;
        //todo : generate jwt and return it here
        //sub -> jwt standart
        const payLoad = {sub:user.id, email:user.email}
        return {access_token: await this.jwtService.signAsync(payLoad) };
    }
}
