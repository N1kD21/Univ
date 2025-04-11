import { IsOptional, IsIn, IsDateString } from 'class-validator';

export class GetDemographicsStatsDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsIn(['facebook', 'tiktok'])
  source?: 'facebook' | 'tiktok';
}
