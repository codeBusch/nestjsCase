import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards,Request, Delete, Param } from '@nestjs/common';
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
    async login(@Body() signInDto:LoginDto){
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


   
    @Delete('/:id')
    async deleteUser(@Param('id') id: number) {
      
        return   await this.usersService.deleteOneById(id);
    }
    
    // @UseGuards(AuthGuard)
    @Get("getallusers")  
    async getAll(@Request() req:any){
        return this.usersService.getAll();
    }
}
