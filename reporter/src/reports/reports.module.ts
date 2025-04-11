import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [ReportsService],
  exports: [ReportsService],
  imports: [PrismaModule],
})
export class ReportsModule {}
