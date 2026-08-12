import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    name: 'email',
    required: true,
    example: 'foo@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    required: true,
    example: 'password',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
