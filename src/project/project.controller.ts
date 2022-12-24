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
import { EditProjectDto } from './dto';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';

@UseGuards(JwtGuard)
@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('')
  getProjects(@GetUser('id') userId: number) {
    return this.projectService.getProjects(userId);
  }

  @Get(':id')
  getProjectById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.getProjectById(userId, projectId);
  }

  @Post()
  createProject(@GetUser('id') userId: number, @Body() dto: CreateProjectDto) {
    return this.projectService.createProject(userId, dto);
  }

  @Patch(':id')
  editProjectById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: EditProjectDto,
  ) {
    return this.projectService.editProjectById(userId, projectId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProjectById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.deleteProjectById(userId, projectId);
  }
}
