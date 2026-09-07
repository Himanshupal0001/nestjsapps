import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesEntity } from './entities/notes.entitiy';
import { ConfigModule } from '@nestjs/config';
import { NoteController } from './notes.controller';
import { NoteService } from './notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotesEntity]), ConfigModule],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NotesModule {}
