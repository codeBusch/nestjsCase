import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dtos/register';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService, private usersService:UsersService){}

    @HttpCode(HttpStatus.OK)
    @Post("login")    
    login(@Body() signInDto:LoginDto){
        return this.authService.login(signInDto.email,signInDto.password);
    } 


    @Post('register')
    async register(@Body() user: RegisterDto): Promise<any> {
    return  this.usersService.create(user);
    }

    @UseGuards(AuthGuard)
    @Get("profile")
    async getProfile(@Request() req:any){
        return this.usersService.findOneById(req.user.sub);
    }
}
