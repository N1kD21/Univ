import {
  IsIn,
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class FacebookUserLocationDto {
  @IsString()
  country: string;

  @IsString()
  city: string;
}

class FacebookUserDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsIn(['male', 'female', 'non-binary'])
  gender: 'male' | 'female' | 'non-binary';

  @ValidateNested()
  @Type(() => FacebookUserLocationDto)
  location: FacebookUserLocationDto;
}

class FacebookEngagementTopDto {
  @IsString()
  actionTime: string;

  @IsIn(['newsfeed', 'marketplace', 'groups'])
  referrer: 'newsfeed' | 'marketplace' | 'groups';

  @IsOptional()
  @IsString()
  videoId: string | null;
}

class FacebookEngagementBottomDto {
  @IsString()
  adId: string;

  @IsString()
  campaignId: string;

  @IsIn(['top_left', 'bottom_right', 'center'])
  clickPosition: 'top_left' | 'bottom_right' | 'center';

  @IsIn(['mobile', 'desktop'])
  device: 'mobile' | 'desktop';

  @IsIn(['Chrome', 'Firefox', 'Safari'])
  browser: 'Chrome' | 'Firefox' | 'Safari';

  @IsOptional()
  @IsString()
  purchaseAmount: string | null;
}

export class FacebookEventDto {
  @IsString()
  eventId: string;

  @IsString()
  timestamp: string;

  @IsIn(['facebook'])
  source: 'facebook';

  @IsIn(['top', 'bottom'])
  funnelStage: 'top' | 'bottom';

  @IsString()
  @IsIn([
    'ad.view',
    'page.like',
    'comment',
    'video.view',
    'ad.click',
    'form.submission',
    'checkout.complete',
  ])
  eventType: string;

  @ValidateNested()
  @Type(() => FacebookUserDto)
  data: {
    user: FacebookUserDto;
    engagement: FacebookEngagementTopDto | FacebookEngagementBottomDto;
  };
}
