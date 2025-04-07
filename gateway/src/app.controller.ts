import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { EventDto } from './dto/event.dto';
import { Event } from './types/events';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async receiveEvent(@Body() events: EventDto) {
    console.log('📥 Received new events');
    await this.appService.publishEvent(events as unknown as Event[]);
    return { status: 'ok' };
  }
}
