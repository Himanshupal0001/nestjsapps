import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateNotesDto {
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
}
