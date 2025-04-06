import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  connect,
  NatsConnection,
  JetStreamClient,
  JetStreamManager,
  StringCodec,
} from 'nats';
import { Event } from './types/events';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private jsm: JetStreamManager;
  private js: JetStreamClient;
  private sc = StringCodec();

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
    const sub: string[] = [
      'tiktok.video.view',
      'tiktok.like',
      'tiktok.share',
      'tiktok.comment',
      'tiktok.profile.visit',
      'tiktok.purchase',
      'tiktok.follow',
      'facebook.ad.view',
      'facebook.page.like',
      'facebook.comment',
      'facebook.video.view',
      'facebook.ad.click',
      'facebook.form.submission',
      'facebook.checkout.complete',
    ];
    try {
      await this.jsm.streams.add({
        name: streamName,
        subjects: sub,
        max_age: 60 * 60 * 1e9,
        max_bytes: 1000000000,
        max_msgs: 10000,
      });

      console.log(`Stream ${streamName} created.`);
    } catch (error) {
      console.error('Error creating stream:', error);
    }
  }
}
