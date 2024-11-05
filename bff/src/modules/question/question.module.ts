import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { QuestionController } from './question.controller';

@Module({
  controllers: [QuestionController],
  imports: [
    ClientsModule.register([
      {
        name: 'QUESTION_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:3001',
          package: 'question',
          protoPath: join(__dirname, '../../../../proto/question.proto'),
        },
      },
    ]),
  ],
})
export class QuestionModule {}
