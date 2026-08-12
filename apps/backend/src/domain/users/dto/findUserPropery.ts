import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class FindUserByPropertyDto {
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
}
