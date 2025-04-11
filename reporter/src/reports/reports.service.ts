import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetEventStatsDto } from './dto/get-event-stats.dto';
import {
  FacebookEngagementBottom,
  TiktokEngagementBottom,
} from './types/events';
import { DemographicData } from './types/demographicData';
import { EventType } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getEventStats(query: GetEventStatsDto) {
    const { from, to, source, funnelStage } = query;
    let eventType = query.eventType;
    if (eventType) {
      const validEventTypes = Object.values(EventType);
      eventType = eventType.replace('.', '_') as EventType;
      if (!validEventTypes.includes(eventType)) {
        throw new Error(`Invalid eventType: ${eventType}`);
      }
    }
    const data = {
      where: {
        timestamp: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
        ...(source && { platform: source }),
        ...(funnelStage && { funnelStage }),
        ...(eventType && {
          eventType: eventType,
        }),
      },
    };
    console.log('data', data);
    const events = await this.prisma.event.findMany(data);
    console.log('events', events);
    return events;
  }

  async getRevenue(query: GetEventStatsDto): Promise<number> {
    const { from, to, source, campaignId } = query;

    const result = await this.prisma.event.findMany({
      where: {
        timestamp: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
        platform: source,
        eventType: {
          in: ['checkout_complete', 'purchase'],
        },
      },
      select: {
        data: true,
      },
    });

    const filtered = campaignId
      ? result.filter((e) => {
          try {
            const data = e.data as unknown as {
              engagement: FacebookEngagementBottom | TiktokEngagementBottom;
            };
            if ('campaignId' in data.engagement) {
              return data.engagement.campaignId === campaignId;
            }
          } catch {
            return false;
          }
        })
      : result;

    const totalRevenue =
      Math.round(
        filtered.reduce((sum, e) => {
          try {
            const data = e.data as unknown as {
              engagement: FacebookEngagementBottom | TiktokEngagementBottom;
            };
            const amount = parseFloat(data.engagement?.purchaseAmount ?? '0');
            return sum + (isNaN(amount) ? 0 : amount);
          } catch {
            return sum;
          }
        }, 0) * 100,
      ) / 100;

    return totalRevenue;
  }

  async getDemographics(query: GetEventStatsDto): Promise<DemographicData[]> {
    const { from, to, source } = query;

    const result = await this.prisma.event.findMany({
      where: {
        timestamp: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
        platform: source,
      },
      select: {
        userId: true,
        platform: true,
      },
    });

    const demographicsPromises = result.map(async (event) => {
      const user = (await this.prisma.user.findUnique({
        where: { userId: event.userId },
        include:
          event.platform === 'facebook' ? { facebook: true } : { tiktok: true }, // "tiktok" is a valid platform name
      })) as {
        facebook?: {
          age: number;
          gender: string;
          country: string;
          city: string;
        };
        tiktok?: { followers: number }; // "tiktok" is a valid property name
      } | null;

      const demographicData: DemographicData = {
        platform: event.platform,
        userId: event.userId,
        demographics: {},
      };

      if (event.platform === 'facebook' && user?.facebook) {
        demographicData.demographics.age = user.facebook.age;
        demographicData.demographics.gender = [
          'male',
          'female',
          'non-binary',
        ].includes(user.facebook.gender)
          ? (user.facebook.gender as 'male' | 'female' | 'non-binary')
          : undefined;
        demographicData.demographics.location = {
          country: user.facebook.country,
          city: user.facebook.city,
        };
      } else if (event.platform === 'tiktok' && user?.tiktok) {
        demographicData.demographics.followers = user.tiktok.followers;
      }

      return demographicData;
    });

    const demographics = await Promise.all(demographicsPromises);

    return demographics;
  }
}
