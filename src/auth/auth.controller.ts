import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dtos/register';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService, private usersService:UsersService){}

    @HttpCode(HttpStatus.OK)
    @Post("login")    
    login(@Body() signInDto:LoginDto){
        return this.authService.signIn(signInDto.email,signInDto.password);
    } 
    @Post('register')
    async register(@Body() user: RegisterDto): Promise<any> {
   
    return  this.usersService.create(user);
 }

}
