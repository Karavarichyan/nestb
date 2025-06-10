import { IsEmail, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email: string

  @MinLength(6, { message: 'password must  bi more then 6 symbol' })
  password: string
}
