import { Test, TestingModule } from '@nestjs/testing';
import { MessageProcessorWorker } from './message-processor-worker.service';

describe('MessageProcessorWorkerService', () => {
  let service: MessageProcessorWorker;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageProcessorWorker],
    }).compile();

    service = module.get<MessageProcessorWorker>(MessageProcessorWorker);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
