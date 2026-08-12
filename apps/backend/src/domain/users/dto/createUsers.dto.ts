import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    name: 'name',
    required: true,
    example: 'foo',
  })
  @IsString()
  name: string;

  @ApiProperty({
    name: 'email',
    required: true,
    example: 'foo@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    required: true,
    example: 'Dfjei_de@45Fee',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
