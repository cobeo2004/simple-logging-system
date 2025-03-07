import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { ApiKeyGuard } from 'src/api-key/api-key.guard';
import { CreateLogDto, LogFiltersDTO } from './logs.dto';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}
  @Post()
  @UseGuards(ApiKeyGuard)
  async createLog(@Body() createLogDto: CreateLogDto) {
    return this.logsService.create(createLogDto);
  }
  @Get()
  @UseGuards(ApiKeyGuard)
  async findAll(@Query() query: LogFiltersDTO) {
    const filters = {
      startDate: query.startDate
        ? new Date(query.startDate)
        : new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: query.endDate ? new Date(query.endDate) : new Date(),
      level: query.level,
      source: query.source,
      search: query.search,
      order: query.order || 'DESC',
      skip: query.page ? (query.page - 1) * (query.limit || 20) : 0,
      take: query.limit || 20,
    };

    const { logs, total } = await this.logsService.findAll(filters);

    return {
      data: logs,
      meta: {
        total,
        page: query.page || 1,
        limit: query.limit || 20,
        pages: Math.ceil((total as number) / (query.limit || 20)),
      },
    };
  }

  @Get('sources')
  @UseGuards(ApiKeyGuard)
  async getSources() {
    return this.logsService.getDistinctSources();
  }

  @Get('levels')
  @UseGuards(ApiKeyGuard)
  async getLevels() {
    return this.logsService.getDistinctLevels();
  }
}
