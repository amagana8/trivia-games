import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './modules/question/question.module';
import { GridGameModule } from './modules/grid-game/grid-game.module';

@Module({
  imports: [QuestionModule, GridGameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
