import { EventType } from '@prisma/client';
import { IsOptional, IsString, IsIn, IsDateString } from 'class-validator';

export class GetEventStatsDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsIn(['facebook', 'tiktok'])
  source?: 'facebook' | 'tiktok';

  @IsOptional()
  @IsIn(['top', 'bottom'])
  funnelStage?: 'top' | 'bottom';

  @IsOptional()
  @IsString()
  campaignId?: string;

  @IsOptional()
  @IsString()
  eventType?: EventType;
}
