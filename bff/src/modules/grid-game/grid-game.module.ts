import { Module } from '@nestjs/common';
import { GridGameController } from './grid-game.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [GridGameController],
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'GRID_GAME_PACKAGE',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              url: configService.get('GAME_SERVICE_URL'),
              package: 'gridGame',
              protoPath: join(__dirname, '../../../../proto/gridGame.proto'),
            },
          }),
        },
      ],
    }),
  ],
})
export class GridGameModule {}
