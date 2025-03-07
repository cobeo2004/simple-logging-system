import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateLogDto } from './logs.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);
  constructor(private prisma: PrismaService) {}

  async create(createLogDto: CreateLogDto) {
    if (
      !createLogDto.timestamp ||
      !createLogDto.level ||
      !createLogDto.message ||
      !createLogDto.source
    ) {
      throw new BadRequestException('Missing required log fields');
    }

    return this.prisma.log.create({
      data: createLogDto,
    });
  }

  async findAll(filters: any = {}) {
    try {
      // Build where conditions based on filters
      const where: any = {};

      if (filters.startDate && filters.endDate) {
        try {
          // Ensure dates are properly parsed and in the correct format
          const startDate = new Date(filters.startDate);
          const endDate = new Date(filters.endDate);

          // Validate that the dates are valid
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date format');
          }

          // Set time to beginning of day for startDate and end of day for endDate
          // to include the entire day range
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);

          where.receivedAt = {
            gte: startDate,
            lte: endDate,
          };

          this.logger.log(
            `Date range filter: ${startDate.toISOString()} to ${endDate.toISOString()}`,
          );
        } catch (error) {
          this.logger.error(`Invalid date format: ${error.message}`);
          throw new BadRequestException('Invalid date format');
        }
      }

      if (filters.level) {
        where.level = filters.level;
      }

      if (filters.source) {
        where.source = filters.source;
      }

      if (filters.search) {
        where.message = {
          contains: filters.search,
          mode: 'insensitive', // Case insensitive search
        };
      }

      // Calculate pagination parameters
      const skip = parseInt(filters.skip) || 0;
      const take = parseInt(filters.take) || 20;

      this.logger.log('Where clause: ');
      this.logger.log(JSON.stringify(where));

      // Execute query with count
      const [logs, total] = await Promise.all([
        this.prisma.log.findMany({
          where,
          orderBy: {
            receivedAt: filters.order?.toUpperCase() === 'ASC' ? 'asc' : 'desc',
          },
          skip,
          take,
        }),
        this.prisma.log.count({ where }),
      ]);

      this.logger.log(`Found ${total} logs matching criteria`);
      return { logs, total };
    } catch (error) {
      this.logger.error(`Error fetching logs: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getDistinctSources() {
    const sources = await this.prisma.log.findMany({
      select: {
        source: true,
      },
      distinct: ['source'],
    });
    return sources.map((s) => s.source);
  }

  async getDistinctLevels() {
    const levels = await this.prisma.log.findMany({
      select: {
        level: true,
      },
      distinct: ['level'],
    });
    return levels.map((l) => l.level);
  }
}
