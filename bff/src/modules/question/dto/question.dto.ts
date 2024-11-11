import { Question } from 'src/pb/question';

export class QuestionDto implements Question {
  id: string;
  authorId: string;
  query: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}
