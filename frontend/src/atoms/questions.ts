import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { trpc } from '../trpc';
import { gridGameAtom } from './gridGame';

export const allQuestionsQueryAtom = atom(() => trpc.question.getAllQuestions.query());

export const availableQuestionsAtom = atom(async (get) => {
  const allQuestions = await get(allQuestionsQueryAtom);
  const currentGridGameState = get(gridGameAtom);

  const availableQuestions = { ...allQuestions.questionMap };
  currentGridGameState.grid
    .flatMap(({ questions }) => questions)
    .forEach((questionId) => {
      delete availableQuestions[questionId];
    });

  return Object.keys(availableQuestions);
});

export const questionAtom = atomFamily((id: string) =>
  atom(async (get) => (await get(allQuestionsQueryAtom)).questionMap[id])
);
