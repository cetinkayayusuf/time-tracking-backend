import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, EditProjectDto } from './dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  getProjects(userId: number) {
    return this.prisma.project.findMany({
      where: {
        userId,
      },
    });
  }

  getProjectById(userId: number, projectId: number) {
    return this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });
  }

  async createProject(userId: number, dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        userId,
        ...dto,
      },
    });

    return project;
  }

  async editProjectById(
    userId: number,
    projectId: number,
    dto: EditProjectDto,
  ) {
    // get the project by id
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    // check if user owns the project
    if (!project || project.userId !== userId)
      throw new ForbiddenException('Access to resource denied');

    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProjectById(userId: number, projectId: number) {
    // get the project by id
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    // check if user owns the project
    if (!project || project.userId !== userId)
      throw new ForbiddenException('Access to resource denied');

    await this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  }
}
