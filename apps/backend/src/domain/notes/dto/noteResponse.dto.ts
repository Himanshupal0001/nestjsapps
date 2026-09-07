import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class NoteResponseDto {
  @ApiProperty({
    name: 'id',
    required: true,
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    name: 'title',
    required: false,
    example: 'document title',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    name: 'note',
    required: true,
    example: 'Loreum Ipsum',
  })
  @IsString()
  note: string;

  @ApiProperty({
    name: 'createdAt',
    required: false,
    example: 'date string',
  })
  @IsDate()
  createdAt: Date;
}
