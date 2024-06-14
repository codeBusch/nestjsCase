import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '../auth/dtos/register';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
   
}
