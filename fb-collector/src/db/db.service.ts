import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FacebookEvent, FunnelStage } from '../types/events';
import { Gender } from '@prisma/client';

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
    const userId = event.data.user.userId;
    const gender = (
      event.data.user.gender === 'non-binary'
        ? 'non_binary'
        : event.data.user.gender
    ) as Gender;

    const userData = {
      userId,
      source: 'facebook' as const,
      facebook: {
        create: {
          name: event.data.user.name,
          age: event.data.user.age,
          gender,
          country: event.data.user.location.country,
          city: event.data.user.location.city,
        },
      },
    };

    const eventType = event.eventType.replace('.', '_') as EventDb['eventType'];

    const eventData: EventDb = {
      eventId: event.eventId,
      timestamp: new Date(event.timestamp),
      funnelStage: event.funnelStage,
      eventType,
      userId,
      platform: 'facebook',
      data: event.data,
    };

    return await this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { userId },
      });

      if (!existingUser) {
        try {
          await tx.user.create({ data: userData });
        } catch (error: any) {
          console.error('Error creating user:', error);
          return null;
        }
      }
      try {
        return await tx.event.create({ data: eventData });
      } catch (error) {
        console.error('Error creating event:', error);
        return null;
      }
    });
  }
}
