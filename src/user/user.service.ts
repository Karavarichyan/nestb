// import { BadRequestException, Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';
// import { Repository } from 'typeorm';
// // import { UpdateUserDto } from './dto/update-user.dto';

// @Injectable()
// export class UserService {

//   constructor(
//     @InjectRepository(User) private readonly userRepository: Repository<User>
//   ){}
//   async create(createUserDto: CreateUserDto) {
//     const existUser = await this.userRepository.findOne({
//       where:{
//          email: createUserDto.email
//       }
//     })
//     if(existUser) throw new BadRequestException (' this email alredy exist ')
//        const user = await this.userRepository.save{(
//       email: CreateUserDto.email,
//         password: '',
//     )}
//     return 'This action adds a new user';
//   }



//   // findOne(id: number) {
//   //   return `This action returns a #${id} user`;
//   // }

//   // findAll() {
//   //   return `This action returns all user`;
//   // }
//   // update(id: number, updateUserDto: UpdateUserDto) {
//   //   return `This action updates a #${id} user`;
//   // }

//   // remove(id: number) {
//   //   return `This action removes a #${id} user`;
//   // }
// }


import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from "argon2";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existUser) {
      throw new BadRequestException('This email already exists');
    }

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    });
    const token = this.jwtService.sign({email:createUserDto.email})

    return {user, token};
  }
  async findOne(email: string){
    return  await this.userRepository.findOne({ where:{
      email,
    }})
  }
}
