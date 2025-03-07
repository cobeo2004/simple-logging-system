import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsObject,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class LogDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(['error', 'info', 'warn', 'debug'])
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsDate()
  @IsNotEmpty()
  timestamp: Date;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}

export class CreateLogDto {
  @IsDate()
  @IsNotEmpty()
  timestamp: Date;

  @IsDate()
  @IsNotEmpty()
  receivedAt: Date;

  @IsEnum(['error', 'info', 'warn', 'debug'])
  @IsNotEmpty()
  level: 'error' | 'info' | 'warn' | 'debug';

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

export class LogFiltersDTO {
  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;

  @IsString()
  @IsOptional()
  level: string;

  @IsString()
  @IsOptional()
  source: string;

  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  order: string;

  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;
}
