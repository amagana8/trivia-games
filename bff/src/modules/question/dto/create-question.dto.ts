import { CreateQuestionRequest } from 'src/pb/question';

export class CreateQuestionDto implements CreateQuestionRequest {
  authorId: string;
  query: string;
  answer: string;
}
