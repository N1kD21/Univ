import { TiktokEventDto } from './tiktokEvent.dto';
import { FacebookEventDto } from './facebookEvent.dto';

export class EventDto {
  events: FacebookEventDto[] | TiktokEventDto[];
}
