import { Test, TestingModule } from '@nestjs/testing';
import { DataTrafficService } from './data-traffic.service';

describe('DataTrafficService', () => {
  let service: DataTrafficService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataTrafficService],
    }).compile();

    service = module.get<DataTrafficService>(DataTrafficService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
