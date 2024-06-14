import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDto } from './dtos/user-dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'
@Injectable()
export class UsersService {
    constructor( 
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    async create(userDto: CreateUserDto): Promise<any> {
        let newUserEntity = new User();
        newUserEntity.email= userDto.email;
        newUserEntity.name= userDto.name;
        newUserEntity.surname= userDto.surname;
        newUserEntity.password= userDto.password;
        const savedUser = await this.userRepository.save(newUserEntity);
        return savedUser;
      }

  
}
