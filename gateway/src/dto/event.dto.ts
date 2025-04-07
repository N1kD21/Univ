/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsArray } from 'class-validator';
import { TiktokEventDto } from './tiktokEvent.dto';
import { FacebookEventDto } from './facebookEvent.dto';

export class EventDto {
  @IsArray()
  events: FacebookEventDto[] | TiktokEventDto[];
}
