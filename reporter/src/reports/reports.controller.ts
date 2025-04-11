import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetEventStatsDto } from './dto/get-event-stats.dto';
import { GetRevenueStatsDto } from './dto/get-revenue-stats.dto';
import { GetDemographicsStatsDto } from './dto/get-demographics-stats.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('events')
  getEventStats(@Query() query: GetEventStatsDto) {
    return this.reportsService.getEventStats(query);
  }

  @Get('revenue')
  getRevenue(@Query() query: GetRevenueStatsDto) {
    return this.reportsService.getRevenue(query);
  }

  @Get('demographics')
  getDemographics(@Query() query: GetDemographicsStatsDto) {
    console.log('sssssssssssssssssssssssssssssss');
    return this.reportsService.getDemographics(query);
  }
}
