import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotesEntity } from './entities/notes.entitiy';
import { Repository } from 'typeorm';
import { CreateNotesDto } from './dto/createNote.dto';
import { UserEntity } from '../users/entities/users.entity';
import { NoteResponseDto } from './dto/noteResponse.dto';
import { UpdateNoteDto } from './dto/updateNote.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class NoteService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(NotesEntity)
    private readonly notesRepository: Repository<NotesEntity>,
  ) {}

  async createNote(
    dto: CreateNotesDto,
    userId: number,
  ): Promise<NoteResponseDto> {
    const noteEntity = this.notesRepository.create();

    const saveEntity = {
      ...noteEntity,
      ...dto,
      user: { id: userId } as UserEntity,
    };
    try {
      await this.notesRepository.save(saveEntity);
      this.logger.log('Note created successfuly');
      return saveEntity;
    } catch (err) {
      this.logger.log(err);
      throw new Error('Something went wrong');
    }
  }

  async getUserNotes(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<NoteResponseDto>> {
    const qb = this.notesRepository.createQueryBuilder('note');
    qb.where('note.userId = :userId', { userId });
    qb.orderBy('note.id', 'DESC');

    return await paginate<NoteResponseDto>(qb, options);
  }

  async updateNote(
    noteId: number,
    userId: number,
    dto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    const note = await this.notesRepository.findOne({
      where: { id: noteId, user: { id: userId } },
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${noteId} not found`);
    }

    // assign field by field: an absent key on the dto is `undefined`, and
    // spreading it over the entity would blank the existing column value
    // if (dto.title !== undefined) {
    //   note.title = dto.title;
    // }
    // if (dto.note !== undefined) {
    //   note.note = dto.note;
    // }
    Object.assign(note, dto);

    try {
      const updatedNote = await this.notesRepository.save(note);
      this.logger.log(`Note ${noteId} updated successfuly`);
      return updatedNote;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteNote(
    noteId: number,
    userId: number,
  ): Promise<{ id: number; success: boolean }> {
    const note = await this.notesRepository.findOne({
      where: { id: noteId, user: { id: userId } },
    });

    if (!note) throw new NotFoundException(`Note with id: ${noteId} not found`);

    await this.notesRepository.remove(note);

    return {
      id: noteId,
      success: true,
    };
  }
}
