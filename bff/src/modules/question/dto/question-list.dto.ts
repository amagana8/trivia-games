import { GetAllQuestionsResponse } from 'src/pb/question';
import { QuestionDto } from './question.dto';

export class QuestionListDto implements GetAllQuestionsResponse {
    questions: QuestionDto[];
}