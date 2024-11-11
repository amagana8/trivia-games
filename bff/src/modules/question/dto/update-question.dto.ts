import { UpdateQuestionRequest } from 'src/pb/question';

export class UpdateQuestionDto implements UpdateQuestionRequest {
  id: string;
  authorId: string;
  query: string;
  answer: string;
}
