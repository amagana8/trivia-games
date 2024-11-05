import { Test, TestingModule } from '@nestjs/testing';
import { GridGameController } from './grid-game.controller';

describe('GridGameController', () => {
  let controller: GridGameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GridGameController],
    }).compile();

    controller = module.get<GridGameController>(GridGameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
