import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { EventsService } from './events/events.service';
import { UserService } from './user/user.service';
import { BullModule } from '@nestjs/bull';
import { MessageQueueModule } from './message-queue/message-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MessageQueueModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, EventsService, UserService],
  exports: [PrismaService, EventsService, UserService],
})
export class AppModule {}
