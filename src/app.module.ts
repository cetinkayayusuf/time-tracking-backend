import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkModule } from './work/work.module';
import { TagModule } from './tag/tag.module';
import { ProjectModule } from './project/project.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    TagModule,
    WorkModule,
    PrismaModule,
  ],
})
export class AppModule {}
