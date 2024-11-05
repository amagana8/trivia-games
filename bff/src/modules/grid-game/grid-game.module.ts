import { Module } from '@nestjs/common';
import { GridGameController } from './grid-game.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  controllers: [GridGameController],
  imports: [
    ClientsModule.register([
      {
        name: 'GRID_GAME_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:3002',
          package: 'gridGame',
          protoPath: join(__dirname, '../../../../proto/gridGame.proto'),
        },
      },
    ]),
  ],
})
export class GridGameModule {}
