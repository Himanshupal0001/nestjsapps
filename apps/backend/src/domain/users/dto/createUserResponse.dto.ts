import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserResponseDto {
  @ApiProperty({
    name: 'id',
    required: true,
    example: 1,
  })
  @IsInt()
  id: number;

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
    example: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    name: 'status',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  status: boolean | null;

  @ApiProperty({
    name: 'regreshtoken',
    required: false,
    example: 'random hash',
  })
  @IsOptional()
  @IsString()
  refreshToken: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
