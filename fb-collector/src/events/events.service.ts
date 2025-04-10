import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FacebookEvent, FunnelStage } from '../types/events';

interface EventDb {
  eventId: string;
  timestamp: Date;
  funnelStage: FunnelStage; // Replace with an appropriate enum or type if available
  eventType:
    | 'ad_view'
    | 'page_like'
    | 'comment'
    | 'video_view'
    | 'ad_click'
    | 'form_submission'
    | 'checkout_complete'; // Replace with an appropriate enum or type if available
  // eventType: FacebookTopEventType | FacebookBottomEventType;
  userId: string;
  platform: 'facebook' | 'tiktok'; // Replace with an appropriate enum or type if available
  data: Record<string, any>; // Adjust the type based on your data structure
}

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async createEvent(data: FacebookEvent) {
    const eventType = data.eventType.replace('.', '_') as
      | 'ad_view'
      | 'page_like'
      | 'comment'
      | 'video_view'
      | 'ad_click'
      | 'form_submission'
      | 'checkout_complete';
    const eventDb: EventDb = {
      eventId: data.eventId,
      timestamp: new Date(data.timestamp),
      funnelStage: data.funnelStage,
      eventType: eventType,
      userId: data.data.user.userId,
      platform: data.source,
      data: data.data,
    };

    return await this.prismaService.event.create({ data: eventDb });
  }
}
