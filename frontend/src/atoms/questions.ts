import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { trpc } from '../trpc';
import { gridGameAtom } from './gridGame';

export const allQuestionsQueryAtom = atom(() => trpc.question.getAllQuestions.query());

export const availableQuestionsAtom = atom(async (get) => {
  const allQuestions = await get(allQuestionsQueryAtom);
  const currentGridGameState = get(gridGameAtom);

  currentGridGameState.grid
    .flatMap(({ questions }) => questions)
    .forEach((questionId) => {
      delete allQuestions.questionMap[questionId];
    });

  return Object.keys(allQuestions.questionMap);
});

export const questionAtom = atomFamily((id: string) =>
  atom(async (get) => (await get(allQuestionsQueryAtom)).questionMap[id])
);
