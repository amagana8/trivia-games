import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { QuestionController } from './question.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [QuestionController],
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'QUESTION_PACKAGE',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              url: configService.get('QUESTION_SERVICE_URL'),
              package: 'question',
              protoPath: join(__dirname, '../../../../proto/question.proto'),
            },
          }),
        },
      ],
    }),
  ],
})
export class QuestionModule {}
