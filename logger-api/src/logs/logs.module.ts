import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { LogRetentionService } from './logs-retention/logs-retention.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [LogsController],
  providers: [LogsService, LogRetentionService],
  exports: [LogsService],
})
export class LogsModule {}
