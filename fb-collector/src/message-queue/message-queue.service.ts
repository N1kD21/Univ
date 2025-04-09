import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MessageQueueService {
  constructor(
    @InjectQueue('messageQueue') private readonly messageQueue: Queue,
  ) {}

  // Метод для добавления сообщений в очередь
  async addMessageToQueue(content: string) {
    await this.messageQueue.add('processMessages', { content });
    console.log('Сообщение добавлено в очередь');
  }
}
