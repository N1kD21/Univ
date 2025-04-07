import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  connect,
  NatsConnection,
  JetStreamManager,
  StreamInfo,
  JetStreamClient,
  AckPolicy,
  StringCodec,
  ConsumerOpts,
} from 'nats';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private jsm: JetStreamManager;
  private streams: StreamInfo[];
  private subs: string[] = [];
  private js: JetStreamClient;
  private sc = StringCodec();
  async onModuleInit() {
    this.nc = await connect({
      servers: [process.env.NATS_SERVER || 'nats://nats:4222'],
    });

    this.jsm = await this.nc.jetstreamManager();
    this.streams = await this.jsm.streams.list().next();
    this.streams.forEach((si) => {
      console.log(si);
    });
    this.js = this.nc.jetstream();

    //creating consumer for facebook
    const stream = this.streams.filter(
      (stream) => stream.config.name === 'facebook',
    )[0];
    const consumerConfig = {
      durable_name: `${stream.config.name}_consumer`,
      ack_policy: AckPolicy.None,
    };

    try {
      await this.jsm.consumers.add(stream.config.name, consumerConfig);
      this.subs.push(stream.config.name);
    } catch (error) {
      console.error(
        `❌ Error creating consumer for stream ${stream.config.name}:`,
        error,
      );
    }
    await this.subscribeToStreams(stream);
  }

  async subscribeToStreams(stream: StreamInfo) {
    for (const subject of stream.config.subjects) {
      const consumerOpts: ConsumerOpts = {
        config: {
          ack_policy: AckPolicy.None,
          max_ack_pending: 10000,
          ack_wait: 1000,
          filter_subject: subject,
        },
        ordered: true,
        stream: stream.config.name,
        name: `${stream.config.name}_consumer`,
        mack: false,
        max: 10000,
      };
      const sub = await this.js.subscribe(subject, consumerOpts);
      for await (const msg of sub) {
        console.log(`Message receive: ${this.sc.decode(msg.data)}`);
        msg.ack();
      }
    }
  }

  async onModuleDestroy() {
    await this.nc.close();
  }
}
