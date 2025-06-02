import {
  api,
  atom,
  injectAtomInstance,
  injectAtomValue,
  injectPromise,
  ion,
} from '@zedux/react';

import { trpc } from '../trpc';
import { gridGameAtom } from './gridGame';

export const allQuestionsQueryAtom = atom('allQuestions', () => {
  const getQuestionsApi = injectPromise(
    () => trpc.question.getMyQuestions.query(),
    [],
  );

  return getQuestionsApi;
});

export const availableQuestionsAtom = atom(
  'availableQuestions',
  (gridGameId: string) => {
    const questionsAtomInstance = injectAtomInstance(allQuestionsQueryAtom);
    const { data: allQuestions } = questionsAtomInstance.get();
    const currentGridGameState = injectAtomValue(gridGameAtom, [gridGameId]);

    const availableQuestions = { ...allQuestions?.questionMap };

    currentGridGameState.grid
      .flatMap(({ questions }) => questions)
      .forEach((questionId) => {
        delete availableQuestions[questionId];
      });

    return api(Object.keys(availableQuestions)).setPromise(
      questionsAtomInstance.promise,
    );
  },
);

export const questionAtom = ion('question', ({ getNode }, id: string) => {
  const allQuestionsNode = getNode(allQuestionsQueryAtom);
  const { data: allQuestions } = allQuestionsNode.get();

  return api(allQuestions?.questionMap[id]).setPromise(
    allQuestionsNode.promise,
  );
});
