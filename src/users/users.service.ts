import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterDto } from '../auth/dtos/register';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'
@Injectable()
export class UsersService {
    constructor( 
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    async create(userDto: RegisterDto): Promise<any> {
        const { email } = userDto;
        const dbUser = await this.userRepository.createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();
            
        if(dbUser){
            throw new HttpException({message: "email must be unique"}, HttpStatus.BAD_REQUEST);
        }

        let newUserEntity = new User();
        newUserEntity.email= userDto.email;
        newUserEntity.name= userDto.name;
        newUserEntity.surname= userDto.surname;
        newUserEntity.password= userDto.password;
        const savedUser = await this.userRepository.save(newUserEntity);
        delete savedUser.password;
        return savedUser;
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        //using method :select password false so  changed findOne function
        const user = await this.userRepository.findOne({ where: { email } , select:["email","password","id"]});
        if (!user) {
            throw new HttpException({ message: "Email not found" }, HttpStatus.NOT_FOUND);
        }
        return user;
    }
    
    async findOneById(id:number): Promise<User | undefined>{
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException({ message: "User not found" }, HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async deleteOneById(id: number): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['orders'] });
        if (!user) {
            throw new HttpException({ message: "User not found" }, HttpStatus.NOT_FOUND);
        }
    
        await this.userRepository.remove(user);
    
        return user;
    }
    
    async getAll(): Promise<User[]> {
        return this.userRepository.find();
    }


  
}
