import { Test, TestingModule } from '@nestjs/testing';
import { SimsService } from './sims.service';

describe('SimsService', () => {
  let service: SimsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimsService],
    }).compile();

    service = module.get<SimsService>(SimsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
