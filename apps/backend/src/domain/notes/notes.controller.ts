import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { NoteService } from './notes.service';
import { CreateNotesDto } from './dto/createNote.dto';
import { NoteResponseDto } from './dto/noteResponse.dto';
import { UpdateNoteDto } from './dto/updateNote.dto';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { Request } from 'express';
import { UserEntity } from '../users/entities/users.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiBearerAuth('authorization')
@ApiTags('notes')
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreateNotesDto,
    description: 'Note create successfully',
  })
  @ApiOkResponse({
    type: NoteResponseDto,
    description: 'notes response',
  })
  @ApiOperation({ description: 'note created succefully' })
  @ApiConsumes('application/json')
  @Post('create')
  async createNote(
    @Body() dto: CreateNotesDto,
    @Req() req: Request,
  ): Promise<NoteResponseDto> {
    return await this.noteService.createNote(dto, (req.user as UserEntity).id);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: NoteResponseDto,
    description: 'paginated notes response of the logged in user',
  })
  @ApiOperation({ description: 'Get all user notes' })
  @Get('all')
  async getUserNotes(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<NoteResponseDto>> {
    const user = req.user as UserEntity;
    return await this.noteService.getUserNotes(user.id, { page, limit });
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: NoteResponseDto,
    description: 'updated note response',
  })
  @ApiOperation({ description: 'Update a note owned by the logged in user' })
  @ApiConsumes('application/json')
  @Patch('update/:id')
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoteDto,
    @Req() req: Request,
  ): Promise<NoteResponseDto> {
    const user = req.user as UserEntity;
    return await this.noteService.updateNote(id, user.id, dto);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Note deleted successfully',
  })
  @ApiOperation({ description: 'Delete a note owned by the logged in user' })
  @Delete('delete/:id')
  async deleteNote(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<{ id: number; success: boolean }> {
    const user = req.user as UserEntity;
    return await this.noteService.deleteNote(id, user.id);
  }
}
