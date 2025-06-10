import { Module } from '@nestjs/common'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategy/local.strategy'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './strategy/jwt.strategy'

@Module({
  imports: [UserModule,PassportModule,JwtModule.registerAsync({
    imports:[ConfigModule],
    useFactory:(ConfigService: ConfigService) => ({
      secret: ConfigService.get('JWT_SECRET'),
      signOptions: {expiresIn:'30d'},
    }),
    inject: [ConfigService],
  })],

  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy],

})
export class AuthModule {}
  // imports: [UsersModule, PassportModule],
  // providers: [AuthService, LocalStrategy],
