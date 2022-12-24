import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

// If there is no injection, don't have to use Injectable
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
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
