import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWorkDto, EditWorkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { start } from 'pactum/src/exports/mock';
import any = jasmine.any;

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
        start: new Date(dto.start),
        end: new Date(dto.start),
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

    const mutatedDto = { ...dto };
    delete mutatedDto.start;
    delete mutatedDto.end;
    if (dto.start !== undefined) {
      // @ts-ignore
      mutatedDto.start = new Date(dto.start);
    }
    if (dto.end !== undefined) {
      // @ts-ignore
      mutatedDto.end = new Date(dto.end);
    }
    return this.prisma.work.update({
      where: {
        id: workId,
      },
      data: {
        ...mutatedDto,
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
