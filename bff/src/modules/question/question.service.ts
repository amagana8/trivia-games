import { createChannel, createClient } from 'nice-grpc';

import { QuestionServiceClient, QuestionServiceDefinition } from '../../pb/question.js';

const channel = createChannel(process.env.QUESTION_SERVICE_URL ?? 'localhost:3001');

export const questionService: QuestionServiceClient = createClient(QuestionServiceDefinition, channel);
