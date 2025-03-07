import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LogRetentionService {
  private readonly logger = new Logger(LogRetentionService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldLogs() {
    this.logger.log('Running log retention cleanup job');

    // Get retention period from config (default 30 days)
    const retentionDays = this.configService.get<number>(
      'LOG_RETENTION_DAYS',
      30,
    );
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    try {
      const result = await this.prisma.log.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      });

      this.logger.log(
        `Deleted ${result.count} log entries older than ${retentionDays} days`,
      );
    } catch (error) {
      this.logger.error(
        `Error cleaning up old logs: ${error.message}`,
        error.stack,
      );
    }
  }
}
