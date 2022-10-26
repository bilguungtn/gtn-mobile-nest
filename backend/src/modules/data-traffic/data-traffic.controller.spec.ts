import { Test, TestingModule } from '@nestjs/testing';
import { DataTrafficController } from './data-traffic.controller';

describe('DataTrafficController', () => {
  let controller: DataTrafficController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataTrafficController],
    }).compile();

    controller = module.get<DataTrafficController>(DataTrafficController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
