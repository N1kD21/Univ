import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FunnelStage, TiktokEvent } from '../types/events';

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

  async trackUserEvent(event: TiktokEvent) {
    const userId = event.data.user.userId;

    const userData = {
      userId,
      source: 'tiktok' as const,
      tiktok: {
        create: {
          username: event.data.user.username,
          followers: event.data.user.followers,
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
      platform: 'tiktok',
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
