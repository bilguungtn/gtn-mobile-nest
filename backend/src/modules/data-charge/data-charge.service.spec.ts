import { Test, TestingModule } from '@nestjs/testing';
import { DataChargeService } from './data-charge.service';

describe('DataChargeService', () => {
  let service: DataChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataChargeService],
    }).compile();

    service = module.get<DataChargeService>(DataChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
