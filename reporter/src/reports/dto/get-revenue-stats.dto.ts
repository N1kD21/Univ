import { IsOptional, IsString, IsIn, IsDateString } from 'class-validator';

export class GetRevenueStatsDto {
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
  @IsString()
  campaignId?: string;
}
