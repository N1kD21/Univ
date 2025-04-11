import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsController } from './reports/reports.controller';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [PrismaModule, ReportsModule],
  controllers: [AppController, ReportsController],
  providers: [AppService],
})
export class AppModule {}
