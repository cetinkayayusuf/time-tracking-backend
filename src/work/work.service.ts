import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWorkDto, EditWorkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkService {
  constructor(private prisma: PrismaService) {}

  getWorks(userId: number) {
    return this.prisma.work.findMany({
      where: {
        userId,
      },
    });
  }

  getWorksByProjectId(userId: number, projectId: number) {
    return this.prisma.work.findMany({
      where: {
        userId,
        projectId,
      },
    });
  }

  getWorkById(userId: number, workId: number) {
    return this.prisma.work.findFirst({
      where: {
        id: workId,
        userId,
      },
    });
  }

  async createWork(userId: number, dto: CreateWorkDto) {
    const work = await this.prisma.work.create({
      data: {
        userId,
        ...dto,
      },
    });

    return work;
  }

  async editWorkById(userId: number, workId: number, dto: EditWorkDto) {
    // get the work by id
    const work = await this.prisma.work.findUnique({
      where: {
        id: workId,
      },
    });

    // check if user owns the work
    if (!work || work.userId !== userId)
      throw new ForbiddenException('Access to resource denied');

    return this.prisma.work.update({
      where: {
        id: workId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteWorkById(userId: number, workId: number) {
    // get the work by id
    const work = await this.prisma.work.findUnique({
      where: {
        id: workId,
      },
    });

    // check if user owns the work
    if (!work || work.userId !== userId)
      throw new ForbiddenException('Access to resource denied');

    await this.prisma.work.delete({
      where: {
        id: workId,
      },
    });
  }
}
