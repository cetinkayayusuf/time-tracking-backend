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
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { CreateTagDto } from './dto';
import { TagService } from './tag.service';

@UseGuards(JwtGuard)
@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get('')
  getTags(@GetUser('id') userId: number) {
    return this.tagService.getTags(userId);
  }

  @Get(':id')
  getTagById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) tagId: number,
  ) {
    return this.tagService.getTagById(userId, tagId);
  }

  @Post()
  createTag(@GetUser('id') userId: number, @Body() dto: CreateTagDto) {
    return this.tagService.createTag(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTagById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) tagId: number,
  ) {
    return this.tagService.deleteTagById(userId, tagId);
  }
}
