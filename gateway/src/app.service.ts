import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  connect,
  NatsConnection,
  JetStreamClient,
  JetStreamManager,
  StringCodec,
  StorageType,
} from 'nats';
import { Event } from './types/events';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private jsm: JetStreamManager;
  private js: JetStreamClient;
  private sc = StringCodec();
  private readonly tiktokSubs: string[] = [
    'tiktok.video.view',
    'tiktok.like',
    'tiktok.share',
    'tiktok.comment',
    'tiktok.profile.visit',
    'tiktok.purchase',
    'tiktok.follow',
  ];

  private readonly facebookSubs: string[] = [
    'facebook.ad.view',
    'facebook.page.like',
    'facebook.comment',
    'facebook.video.view',
    'facebook.ad.click',
    'facebook.form.submission',
    'facebook.checkout.complete',
  ];

  async onModuleInit() {
    this.nc = await connect({
      servers: process.env.NATS_SERVER,
    });
    this.jsm = await this.nc.jetstreamManager();
    await this.createStream('events');

    this.js = this.nc.jetstream();
    console.log(`✅ Connected to NATS`);
  }

  async onModuleDestroy() {
    await this.nc.drain();
  }

  async publishEvent(events: Event[]) {
    const promises = events.map(async (event) => {
      const subject = `${event.source}.${event.eventType}`;
      const data = this.sc.encode(JSON.stringify(event));
      if (!event.source || !event.eventType) {
        console.error('Event:', event);
        console.error('Subject:', subject);
        return;
      }

      try {
        await this.js.publish(subject, data);
      } catch (err: unknown) {
        console.error('Error publishing event:', err);
        console.error('Event:', event);
        console.error('Subject:', subject);
      }
    });

    await Promise.all(promises);
  }

  private async createStream(streamName: string) {
    const configTtk = {
      name: 'tiktok',
      subjects: this.tiktokSubs,
      max_age: 60 * 60 * 1e9,
      max_bytes: 1000000000,
      max_msgs: 10000,
      storage: StorageType.File,
      replicas: 3,
    };
    await this.jsm.streams.add(configTtk);

    const configFb = {
      name: 'facebook',
      subjects: this.facebookSubs,
      max_age: 60 * 60 * 1e9,
      max_bytes: 1000000000,
      max_msgs: 10000,
      storage: StorageType.File,
      replicas: 3,
    };
    await this.jsm.streams.add(configFb);

    console.log(`Streams for ${streamName} created.`);
  }
}
