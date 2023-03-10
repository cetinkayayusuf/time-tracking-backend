import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from '../auth/guard';
import { WorkService } from './work.service';
import { GetUser } from '../auth/decorator';
import { CreateWorkDto, EditWorkDto } from './dto';

@UseGuards(AtGuard)
@Controller('works')
export class WorkController {
  constructor(private workService: WorkService) {}

  @Get()
  getWorks(@GetUser('id') userId: number) {
    return this.workService.getWorks(userId);
  }

  @Get(':id')
  getWorkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) workId: number,
  ) {
    return this.workService.getWorkById(userId, workId);
  }

  @Post()
  createWork(@GetUser('id') userId: number, @Body() dto: CreateWorkDto) {
    return this.workService.createWork(userId, dto);
  }

  @Patch(':id')
  editWorkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) workId: number,
    @Body() dto: EditWorkDto,
  ) {
    return this.workService.editWorkById(userId, workId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteWorkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) workId: number,
  ) {
    return this.workService.deleteWorkById(userId, workId);
  }
}
