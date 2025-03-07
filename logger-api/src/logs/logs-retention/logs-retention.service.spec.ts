import { Test, TestingModule } from '@nestjs/testing';
import { LogsRetentionService } from './logs-retention.service';

describe('LogsRetentionService', () => {
  let service: LogsRetentionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsRetentionService],
    }).compile();

    service = module.get<LogsRetentionService>(LogsRetentionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
