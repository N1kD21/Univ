/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsIn,
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class TiktokUserDto {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsNumber()
  followers: number;
}

class TiktokEngagementTopDto {
  @IsNumber()
  watchTime: number;

  @IsNumber()
  percentageWatched: number;

  @IsIn(['Android', 'iOS', 'Desktop'])
  device: 'Android' | 'iOS' | 'Desktop';

  @IsString()
  country: string;

  @IsString()
  videoId: string;
}

class TiktokEngagementBottomDto {
  @IsString()
  actionTime: string;

  @IsOptional()
  @IsString()
  profileId: string | null;

  @IsOptional()
  @IsString()
  purchasedItem: string | null;

  @IsOptional()
  @IsString()
  purchaseAmount: string | null;
}

export class TiktokEventDto {
  @IsString()
  eventId: string;

  @IsString()
  timestamp: string;

  @IsIn(['tiktok'])
  source: 'tiktok';

  @IsIn(['top', 'bottom'])
  funnelStage: 'top' | 'bottom';

  @IsString()
  @IsIn([
    'video.view',
    'like',
    'share',
    'comment',
    'profile.visit',
    'purchase',
    'follow',
  ])
  eventType: string;

  @ValidateNested()
  @Type(() => TiktokUserDto)
  data: {
    user: TiktokUserDto;
    engagement: TiktokEngagementTopDto | TiktokEngagementBottomDto;
  };
}
