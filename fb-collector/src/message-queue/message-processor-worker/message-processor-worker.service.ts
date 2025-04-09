/* eslint-disable prettier/prettier */
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';

interface UserDb {
  userId: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'non_binary';
  country: string;
  city: string;
  source: 'facebook';
}

@Injectable()
@Processor('messageQueue')
export class MessageProcessorWorker {
  constructor(private readonly userService: UserService) {}

  @Process('processMessages')
  async handleMessage(job: Job<{ content: { data: { user: { userId: string; name: string; age: number; gender: 'male' | 'female' | 'non_binary'; location: { country: string; city: string; } } } } }>) {
    console.log('Обрабатываем сообщение из очереди:', job.data);
    const userData: UserDb = {
      userId: job.data.content.data.user.userId,
      name: job.data.content.data.user.name,
      age: job.data.content.data.user.age,
      gender: job.data.content.data.user.gender,
      country: job.data.content.data.user.location.country,
      city: job.data.content.data.user.location.city,
      source: 'facebook',
    };
    await this.userService.createUser(userData);
  }
}
