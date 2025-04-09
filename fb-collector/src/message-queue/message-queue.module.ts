import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MessageQueueService } from './message-queue.service';
import { MessageProcessorWorker } from './message-processor-worker/message-processor-worker.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'messageQueue',
    }),
  ],
  providers: [
    MessageQueueService,
    MessageProcessorWorker,
    UserService,
    PrismaService,
  ],
  exports: [MessageQueueService],
})
export class MessageQueueModule {}
