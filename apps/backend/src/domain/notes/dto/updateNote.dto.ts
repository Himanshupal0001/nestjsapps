import { PartialType } from '@nestjs/swagger';
import { CreateNotesDto } from './createNote.dto';

export class UpdateNoteDto extends PartialType(CreateNotesDto) {}
