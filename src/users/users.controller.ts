import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/user-dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Post('create')
     async create(@Body() user: CreateUserDto): Promise<any> {
     this.usersService.create(user);
     return "user created"
  }
}
