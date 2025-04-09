import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  connect,
  NatsConnection,
  JetStreamManager,
  StreamInfo,
  JetStreamClient,
  AckPolicy,
} from 'nats';
import { MessageQueueService } from './message-queue/message-queue.service';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private jsm: JetStreamManager;
  private streams: StreamInfo[];
  private js: JetStreamClient;

  constructor(private readonly messageQueueService: MessageQueueService) {}

  async onModuleInit() {
    this.nc = await connect({
      // servers: ['nats://localhost:4222'],
      servers: [process.env.NATS_SERVER || 'nats://nats:4222'],
    });

    this.jsm = await this.nc.jetstreamManager();
    this.streams = await this.jsm.streams.list().next();
    this.streams.forEach((si) => {
      console.log(si);
    });
    this.js = this.nc.jetstream();

    const stream = this.streams.filter(
      (stream) => stream.config.name === 'facebook',
    )[0];

    const consumerConfig = {
      durable_name: `${stream.config.name}_consumer`,
      ack_policy: AckPolicy.Explicit,
    };

    await this.jsm.consumers.add(stream.config.name, consumerConfig);
    await this.subscribeToStreams(stream);
  }

  // reading from stream
  async subscribeToStreams(stream: StreamInfo) {
    const c = await this.js.consumers.get(
      stream.config.name,
      `${stream.config.name}_consumer`,
    );

    let m = await c.next();

    while (m) {
      await this.messageQueueService.addMessageToQueue(m.data.toString());
      m = await c.next();
      if (m) m.ack();
    }

    console.log('# Stream info with one consumer');
    console.log((await this.jsm.streams.info(stream.config.name)).state);
  }

  async onModuleDestroy() {
    await this.nc.close();
  }
}
