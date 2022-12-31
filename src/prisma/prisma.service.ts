import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

// If there is no injection, don't have to use Injectable
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleInit
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  cleanDb() {
    return this.$transaction([
      this.tag.deleteMany(),
      this.work.deleteMany(),
      this.project.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
