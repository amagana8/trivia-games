import { api, atom, ion } from '@zedux/react';

import { trpc } from '../trpc';
import { gridGameAtom } from './gridGame';

export const allQuestionsQueryAtom = atom('allQuestions', () => {
  const promise = trpc.question.getMyQuestions.query();

  return api(promise);
});

export const availableQuestionsAtom = ion(
  'availableQuestions',
  ({ getNode, get }) => {
    const node = getNode(allQuestionsQueryAtom);
    const { data: allQuestions } = node.get();
    const currentGridGameState = get(gridGameAtom);

    const availableQuestions = { ...allQuestions?.questionMap };

    currentGridGameState.grid
      .flatMap(({ questions }) => questions)
      .forEach((questionId) => {
        delete availableQuestions[questionId];
      });

    return api(Object.keys(availableQuestions)).setPromise(node.promise);
  },
);

export const questionAtom = ion('question', ({ getNode }, id: string) => {
  const allQuestionsNode = getNode(allQuestionsQueryAtom);
  const { data: allQuestions } = allQuestionsNode.get();

  return api(allQuestions?.questionMap[id]).setPromise(
    allQuestionsNode.promise,
  );
});
