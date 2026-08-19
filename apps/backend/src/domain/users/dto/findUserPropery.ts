import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class FindUserByPropertyDto {
  @ApiProperty({
    name: 'name',
    required: true,
    example: 'foo',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    name: 'email',
    required: true,
    example: 'foo@email.com',
  })
  @IsOptional()
  @IsEmail()
  email: string;
}
