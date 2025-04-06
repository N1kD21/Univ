import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Event } from './types/events';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/events')
  async receiveEvent(@Body() events: Event[]) {
    console.log('📥 Received new events');
    await this.appService.publishEvent(events);
    return { status: 'ok' };
  }
}
