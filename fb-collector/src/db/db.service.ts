import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FacebookEvent, FunnelStage } from '../types/events';

interface UserDb {
  userId: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'non_binary';
  country: string;
  city: string;
  source: 'facebook';
}

interface EventDb {
  eventId: string;
  timestamp: Date;
  funnelStage: FunnelStage;
  eventType:
    | 'ad_view'
    | 'page_like'
    | 'comment'
    | 'video_view'
    | 'ad_click'
    | 'form_submission'
    | 'checkout_complete';
  userId: string;
  platform: 'facebook' | 'tiktok';
  data: Record<string, any>;
}

@Injectable()
export class DbService {
  constructor(private prisma: PrismaService) {}

  async trackUserEvent(event: FacebookEvent) {
    const userData: UserDb = {
      userId: event.data.user.userId,
      name: event.data.user.name,
      age: event.data.user.age,
      gender:
        event.data.user.gender === 'non-binary'
          ? 'non_binary'
          : event.data.user.gender,
      country: event.data.user.location.country,
      city: event.data.user.location.city,
      source: 'facebook',
    };

    const eventType = event.eventType.replace('.', '_') as EventDb['eventType'];

    const eventData: EventDb = {
      eventId: event.eventId,
      timestamp: new Date(event.timestamp),
      funnelStage: event.funnelStage,
      eventType,
      userId: event.data.user.userId,
      platform: event.source,
      data: event.data,
    };

    return await this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { userId: userData.userId },
      });

      if (!existingUser) {
        await tx.user.create({ data: userData });
      }

      return await tx.event.create({ data: eventData });
    });
  }
}
