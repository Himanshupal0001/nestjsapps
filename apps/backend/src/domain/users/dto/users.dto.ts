import { IsEmail, isStrongPassword } from "class-validator";

export class UserDto{
    @IsEmail()
    email: string,

    @isStrongPassword
    password: string
}