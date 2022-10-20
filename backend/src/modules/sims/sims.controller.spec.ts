import { Test, TestingModule } from '@nestjs/testing';
import { SimsController } from './sims.controller';

describe('SimsController', () => {
  let controller: SimsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimsController],
    }).compile();

    controller = module.get<SimsController>(SimsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
