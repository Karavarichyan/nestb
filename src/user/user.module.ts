import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [TypeOrmModule.forFeature([User]),JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory:(ConfigService: ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET'),
        signOptions: {expiresIn:'30d'},
      }),
      inject: [ConfigService],
    })],
  controllers: [UserController],
  providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
