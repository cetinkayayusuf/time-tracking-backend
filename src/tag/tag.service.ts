import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  getTags(userId: number) {
    return this.prisma.tag.findMany({
      where: {
        userId,
      },
    });
  }

  getTagById(userId: number, tagId: number) {
    return this.prisma.tag.findFirst({
      where: {
        id: tagId,
        userId,
      },
    });
  }

  async createTag(userId: number, dto: CreateTagDto) {
    const tag = await this.prisma.tag.create({
      data: {
        userId,
        ...dto,
      },
    });

    return tag;
  }

  async deleteTagById(userId: number, tagId: number) {
    // get the tag by id
    const tag = await this.prisma.tag.findUnique({
      where: {
        id: tagId,
      },
    });

    // check if user owns the tag
    if (!tag || tag.userId !== userId)
      throw new ForbiddenException('Access to resource denied');

    await this.prisma.tag.delete({
      where: {
        id: tagId,
      },
    });
  }
}
